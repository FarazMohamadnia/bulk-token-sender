import { default as axios } from "axios";
export interface FetchDataProps {
  url: string;
  method: "GET" | "POST";
  body?: any;
  authToken?: string;
}
export const fetchData = async ({
  url,
  method,
  body,
  authToken,
}: FetchDataProps) => {
  const headers: Record<string, string> = {};
  try {
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await axios.request({
      url,
      method,
      data: body,
      headers,
    });
    return response;
  } catch (error: any) {
    console.log(error);
    return error?.response;
  }
};
