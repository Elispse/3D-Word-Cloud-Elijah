const API_URL = import.meta.env.VITE_API_URL;

type WordType = {
    word: string;
    weight: number; 
}

// this function fetches the json list of words and their associated weights
export async function fetchWordCloud(url: string): Promise<WordType[]> {
  try {
    const response = await fetch('${API_URL}', { // replace with your backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WordType[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word cloud:", error);
    return [];
  }
}
