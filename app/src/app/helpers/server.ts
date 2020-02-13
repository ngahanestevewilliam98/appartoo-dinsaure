export class Server {
    static protocole = 'http';
    static host = '127.0.0.1';
    static port = '8085';

    static baseUrl(): string {
        return `${this.protocole}://${this.host}:${this.port}`;
    }
}
