export class User {
  constructor(
    private uemail: string,
    private uname: string,
    private fname: string,
    private lname: string
  ) {}

  public get email(): string {
    return this.uemail;
  }

  public get username(): string {
    return this.uname;
  }

  public get firstname(): string {
    return this.fname;
  }

  public get lastname(): string {
    return this.lname;
  }
}


export interface RegisterResponse {
    id: number,
    user_name: string,
    email: string,
    first_name: string,
    last_name: string
}


export interface AuthResponse {
    message: string,
    token: string,
    expires_in: string,
}

export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        return descriptor.value.bind(this);
      },
    };
  
    return adjDescriptor;
  }
