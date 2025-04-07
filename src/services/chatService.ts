import axios from 'axios';
const API_URL = 'http://localhost:8080/api/';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}
interface Message {
  id: number;
  message: string;
  timestamp: string;
  sentByMe: boolean;
}
interface MessageList {
  id: number;
  name: string;
  picture: string;
  messages: Message[];
}

export async function fetchActiveChats(token: string): Promise<Chat[]> {
  try {
    const response = await axios.get(API_URL + 'negotiation/chat/my_chats', {
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
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    }));
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function fetchConversation(chatId: number, token: string): Promise<MessageList> {
  try {
    const response = await axios.get(API_URL + `negotiation/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const chatData = response.data;
    const formattedMessages = chatData.messages.map((msg: any) => ({
      id: msg.id,
      message: msg.text,
      timestamp: formatTimestamp(msg.sendtAt),
      sentByMe: msg.sendtBySelf,
    }));

    return {
      id: chatData.id,
      name: chatData.other_user_name,
      picture: chatData.other_user_picture || '',
      messages: formattedMessages,
    };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

function formatTimestamp(datetimeStr: string): string {
  const date = new Date(datetimeStr);
  return date.toLocaleString('no-NO', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export async function startConversation(listingId: number, token: string) {
    try {
        const response = await axios.post(API_URL + `negotiation/chat/createFromListing/${listingId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

