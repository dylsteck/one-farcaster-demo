export class IcebreakerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://app.icebreaker.xyz/api/v1";
  }

  async getFarcasterUser(input: string, inputType: 'fid' | 'fname') {
    let url = '';
    if (inputType === 'fid') {
      url = `${this.baseUrl}/fid/${input}`;
    } else if (inputType === 'fname') {
      url = `${this.baseUrl}/fname/${input}`;
    } else {
      throw new Error('Invalid inputType provided');
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch data from Icebreaker API: ${error}`);
      throw new Error('Error fetching Farcaster user profile');
    }
  }
}