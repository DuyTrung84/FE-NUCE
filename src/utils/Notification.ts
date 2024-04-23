import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Notifn = (type: NotificationType, message: string, description: string): void => {
    notification[type]({
        message: message,
        description: description,
    });
};
