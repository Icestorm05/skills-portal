export interface ISnackbar {
    timeout: number;
    color: 'success' | 'warning' | 'error' | 'info';
    message: string;
}