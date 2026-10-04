import { ELECTRONICS_PRODUCTS } from './electronics';
import { FASHION_PRODUCTS } from './fashion';
import { GROCERY_PRODUCTS } from './grocery';
import { MOBILES_PRODUCTS } from './mobiles';
import { GADGETS_PRODUCTS } from './gadgets';
import { SHOES_PRODUCTS } from './shoes';
import { HOME_PRODUCTS } from './home';
import { BEAUTY_PRODUCTS } from './beauty';
import { BABY_PRODUCTS } from './baby';
import { SPORTS_PRODUCTS } from './sports';
import { FURNITURE_PRODUCTS } from './furniture';
import { PETS_PRODUCTS } from './pets';
import { Product } from '../../types';

export const ALL_PRODUCTS: Product[] = [
  ...GROCERY_PRODUCTS,
  ...MOBILES_PRODUCTS,
  ...ELECTRONICS_PRODUCTS,
  ...GADGETS_PRODUCTS,
  ...FASHION_PRODUCTS,
  ...SHOES_PRODUCTS,
  ...HOME_PRODUCTS,
  ...BEAUTY_PRODUCTS,
  ...BABY_PRODUCTS,
  ...SPORTS_PRODUCTS,
  ...FURNITURE_PRODUCTS,
  ...PETS_PRODUCTS
];
