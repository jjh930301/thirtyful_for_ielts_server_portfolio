export const SET_TIME = 1000 * 60;
export const HTTP_TIMEOUT : number = 1000 * 60 * 20;
export const timeout = (time : number | null = 3000) => new Promise((resolve) => setTimeout(resolve, time))

