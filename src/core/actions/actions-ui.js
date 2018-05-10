import constants from 'core/types';

//openLeftNav - Open the left side nav
export function openNav() {
  return {
    type: constants.OPEN_NAV
  };
}

//closeLeftNav - Close the left side nav
export function closeNav() {
  return {
    type: constants.CLOSE_NAV
  };
}

//openRightNav
export function openRightNav() {
  return {
    type: constants.OPEN_RIGHT_NAV
  };
}

//closeRightNav
export function closeRightNav() {
  return {
    type: constants.CLOSE_RIGHT_NAV
  };
}
