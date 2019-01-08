import '@vue/test-utils';

/**
 * Temporary module augmentation as the current @vue/test-utils types
 * does not include the isVisible function type in the BaseWrapper interface.
*/
declare module '@vue/test-utils' {
    interface BaseWrapper {
        isVisible(): boolean;
    }
}
