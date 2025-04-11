import axios from 'axios';
import { fetchDataWithAuth, postDataWithAuth } from './httpService';


interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}
interface Message {
  id: number;
  sentByMe: boolean;
  message?: string;
  timestamp: string;

  isOffer?: boolean;
  offerId?: number;
  price?: number;
  status?: number;
  senderName?: string;

}
interface MessageList {
  id: number;
  name: string;
  picture: string;
  messages: Message[];
}

export async function fetchActiveChats(): Promise<Chat[]> {
  try {
    const response = await fetchDataWithAuth('negotiation/chat/my_chats');

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.other_user_name,
      avatar: item.other_user_picture || '',
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

export async function fetchConversation(chatId: number): Promise<MessageList> {
  try {
    const response = await fetchDataWithAuth(`negotiation/chat/${chatId}`);

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
export async function fetchOffers(chatId: number): Promise<any[]> {
  try {
    const response = await fetchDataWithAuth(`negotiation/offer/getOffers/${chatId}`);
    console.log("Fetched offers:", response.data);
    return response.data.map((offer: any) => ({
      id: offer.id,
      offerId: offer.id,
      senderName: offer.createdByUser ? 'Meg' : offer.creatorName,
      price: offer.currentOffer,
      status: offer.status,
      updatedAt: offer.updatedAt,
      isOffer: true,
      timestamp: formatTimestamp(offer.updatedAt),
      sentByMe: offer.createdByUser,
    }));
  } catch (error) {
    console.error('There was a problem fetching offers:', error);
    throw error;
  }
}


export function formatTimestamp(datetimeStr: string): string {
  console.log("Formatting timestamp:", datetimeStr);
  const date = new Date(datetimeStr);
  return date.toLocaleString('no-NO', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export async function startConversation(listingId: number) {
    try {
        const response = await postDataWithAuth(`negotiation/chat/createFromListing/${listingId}`, {});
        return response.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

