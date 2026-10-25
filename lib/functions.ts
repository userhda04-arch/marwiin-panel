export const fetchMyServers = async () => {
    try {
        const response = await fetch('/api/me/getMyServers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message || !data.myServers) {
                return;
            }

            return data.myServers;
        }

    } catch (error) {
        console.error('Error getting my servers', error);
    }

    return;
}