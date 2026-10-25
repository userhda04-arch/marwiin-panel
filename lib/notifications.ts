import { toast } from "sonner";

export const notify = (title: string, description?: string, actionType?: string, actionLabel?: string, actionString?: string) => {
    if (actionType && actionLabel && actionString) {
        toast(title, {
            description: description,
            action: {
                label: actionLabel,
                onClick: () => {
                    if (actionType == "redirect") {
                        window.location.href = actionString;
                    }
                },
            },
        });
    } else {
        toast(title, {
            description: description
        });
    }
    
    const audio = new Audio(`/notification.ogg`);
    audio.volume = 0.3;
    audio.play();
};