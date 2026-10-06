#pragma once
// Called while Store::mutex is held. Credentials never enter the clients JSON.
class Accounts {
    sqlite3* db;
    std::string dummy;
    static std::string hash_session(const std::string& raw) {
        unsigned char bytes[32];char hex[65];
        crypto_generichash(bytes,sizeof bytes,reinterpret_cast<const unsigned char*>(raw.data()),raw.size(),nullptr,0);
        sodium_bin2hex(hex,sizeof hex,bytes,sizeof bytes);return hex;
    }
    static std::string password_hash(const std::string& password) {
        char hash[crypto_pwhash_STRBYTES];
        if(crypto_pwhash_str(hash,password.data(),password.size(),crypto_pwhash_OPSLIMIT_INTERACTIVE,crypto_pwhash_MEMLIMIT_INTERACTIVE))throw std::runtime_error("Password hashing unavailable");
        return hash;
    }
public:
    explicit Accounts(sqlite3* connection):db(connection) {
        for(auto sql:{
            "CREATE TABLE IF NOT EXISTS accounts(owner TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')))",
            "CREATE TABLE IF NOT EXISTS logins(hash TEXT PRIMARY KEY,owner TEXT NOT NULL,expires INTEGER NOT NULL)",
            "CREATE TABLE IF NOT EXISTS auth_attempts(email TEXT PRIMARY KEY,count INTEGER NOT NULL,until_time INTEGER NOT NULL)"}){Statement q(db,sql);q.step();}
        dummy=password_hash("dummy-account-not-a-password");
    }
    J user(const std::string& session) {
        Statement q(db,"SELECT a.owner,a.email,a.role FROM logins l JOIN accounts a ON a.owner=l.owner WHERE l.hash=? AND l.expires>?");
        q.text(1,hash_session(session));q.number(2,std::time(nullptr));
        if(q.step()!=SQLITE_ROW)return nullptr;
        auto email=q.str(1);std::string mobile;const std::string suffix="@mobile.sabka.local";if(email.size()>suffix.size()&&email.compare(email.size()-suffix.size(),suffix.size(),suffix)==0)mobile=email.substr(0,email.size()-suffix.size());
        return {{"id",q.str(0)},{"email",mobile.empty()?email:std::string()},{"mobile",mobile},{"name",mobile.empty()?email:mobile},{"role",q.str(2)}};
    }
    std::string owner(const std::string& session){auto u=user(session);return u.is_null()?session:u["id"].get<std::string>();}
    bool admin(const std::string& session){auto u=user(session);return !u.is_null()&&u["role"]=="admin";}
    void logout(const std::string& session){Statement q(db,"DELETE FROM logins WHERE hash=?");q.text(1,hash_session(session));q.step();}
    bool exists(const std::string& owner){Statement q(db,"SELECT 1 FROM accounts WHERE owner=?");q.text(1,owner);return q.step()==SQLITE_ROW;}
    void promote(std::string email){email=normalized(email);Statement q(db,"UPDATE accounts SET role='admin' WHERE email=?");q.text(1,email);q.step();if(sqlite3_changes(db)!=1)throw std::invalid_argument("Register the account before promoting it locally");}
    std::string authenticate_mobile(std::string mobile,bool registration) {
        mobile=normalized(mobile);mobile.erase(std::remove_if(mobile.begin(),mobile.end(),[](unsigned char ch){return ch==' '||ch=='-'||ch=='+';}),mobile.end());
        if(mobile.rfind("91",0)==0&&mobile.size()==12)mobile=mobile.substr(2);
        if(!std::regex_match(mobile,std::regex("[0-9]{10}")))throw std::invalid_argument("Enter a valid 10-digit mobile number");
        auto email=mobile+"@mobile.sabka.local";std::string account;
        {Statement q(db,"SELECT owner FROM accounts WHERE email=?");q.text(1,email);if(q.step()==SQLITE_ROW)account=q.str(0);}
        if(registration){
            if(!account.empty())throw std::invalid_argument("This demo mobile profile already exists; use Sign In");
            account="account:"+token();auto hash=password_hash(token()+token());
            Statement q(db,"INSERT INTO accounts(owner,email,password_hash) VALUES(?,?,?)");q.text(1,account);q.text(2,email);q.text(3,hash);q.step();
        }else if(account.empty())throw std::invalid_argument("Demo profile not found; create an account first");
        const auto current=std::time(nullptr);{Statement q(db,"DELETE FROM logins WHERE expires<=?");q.number(1,current);q.step();}
        auto session=token();Statement q(db,"INSERT INTO logins VALUES(?,?,?)");q.text(1,hash_session(session));q.text(2,account);q.number(3,current+3600);q.step();return session;
    }
    std::string authenticate(std::string email,const std::string& password,bool registration) {
        email=normalized(email);
        if(email.size()>254||!std::regex_match(email,std::regex("[a-z0-9._+%-]+@[a-z0-9.-]+\\.[a-z]{2,}")))throw std::invalid_argument("Enter a valid email address");
        if(password.size()<10||password.size()>128)throw std::invalid_argument("Password must be 10 to 128 bytes");
        const auto current=std::time(nullptr);int attempts=0;
        {Statement q(db,"SELECT count,until_time FROM auth_attempts WHERE email=?");q.text(1,email);if(q.step()==SQLITE_ROW&&sqlite3_column_int64(q.p,1)>current)attempts=sqlite3_column_int(q.p,0);}
        if(attempts>=5)throw std::invalid_argument("Too many attempts; try again in 10 minutes");
        std::string account,hash;
        {Statement q(db,"SELECT owner,password_hash FROM accounts WHERE email=?");q.text(1,email);if(q.step()==SQLITE_ROW){account=q.str(0);hash=q.str(1);}}
        bool valid=false;
        if(registration){
            if(!account.empty())throw std::invalid_argument("Account cannot be registered; try logging in");
            account="account:"+token();hash=password_hash(password);
            Statement q(db,"INSERT INTO accounts(owner,email,password_hash) VALUES(?,?,?)");q.text(1,account);q.text(2,email);q.text(3,hash);q.step();valid=true;
        }else valid=crypto_pwhash_str_verify((hash.empty()?dummy:hash).c_str(),password.data(),password.size())==0&&!account.empty();
        if(!valid){Statement q(db,"INSERT INTO auth_attempts VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET count=excluded.count,until_time=excluded.until_time");q.text(1,email);q.number(2,attempts+1);q.number(3,current+600);q.step();throw std::invalid_argument("Invalid email or password");}
        {Statement q(db,"DELETE FROM auth_attempts WHERE email=?");q.text(1,email);q.step();}
        {Statement q(db,"DELETE FROM logins WHERE expires<=?");q.number(1,current);q.step();}
        auto session=token();Statement q(db,"INSERT INTO logins VALUES(?,?,?)");q.text(1,hash_session(session));q.text(2,account);q.number(3,current+3600);q.step();return session;
    }
};
