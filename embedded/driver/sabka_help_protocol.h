#ifndef SABKA_HELP_PROTOCOL_H
#define SABKA_HELP_PROTOCOL_H
#include <linux/types.h>
/* Shared Linux kernel/userspace ABI, native endian, fixed-width fields.
 * Do not change the layout without updating both driver and listener.
 * The device is a write-triggered educational interface, not GPIO hardware.
 */
#define SABKA_KIOSK_ID 101U
#define SABKA_HELP_COMMAND "HELP\n"
struct sabka_event {
    __u32 event_id;
    __u32 kiosk_id;
    __u64 timestamp_ns;
    char trigger_source[32];
};
#endif
