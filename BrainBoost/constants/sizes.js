import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const CARD_WIDTH = width * 0.7;
export const CARD_MARGIN = 20;
export const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;
