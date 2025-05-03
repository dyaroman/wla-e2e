/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type WlaHelper = import('./helpers/wla-helper');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
  }
  interface Methods extends Playwright, WlaHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
