import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';
interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
  }
  export async function fetchActiveChats(token: string): Promise<Chat[]> {
    try {
      const response = await axios.get(API_URL+'negotiation/chat/my_chats',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
      });
        return response.data.map((item: any) => ({
            id: item.id,
            name: item.other_user_name,
            avatar: item.other_user_picture?.filepath_to_image || '',
            lastMessage: item.last_message,
            timestamp: new Date(item.last_update).toLocaleString('nb-NO', {
                year: 'numeric', //had to do all this to format it the way i wanted
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
          }));

    
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }
  