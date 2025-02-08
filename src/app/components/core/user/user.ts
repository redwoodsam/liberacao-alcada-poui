export interface User {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface JwtToken {
    sub: string,
    userid: string,
    iat: number,
    exp: number
}