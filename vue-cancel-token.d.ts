import { CancelTokenSource } from 'axios';
import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $cancelToken: CancelTokenSource;
        $cancelAllRequests: () => void;
    }
}