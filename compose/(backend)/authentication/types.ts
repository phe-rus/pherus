export type createUserWithEmailAndPassword = (args: {
  email: string;
  username: string;
  password: string;
  enableUsername?: boolean;
}) => Promise<any>;

export type signInWithEmailAndPassword = (args: {
  email?: string;
  username?: string;
  password: string;
  rememberMe?: boolean;
}) => Promise<any>;

export type currentUser = () => Promise<any>;

export type AuthProvider = {
  createUserWithEmailAndPassword: createUserWithEmailAndPassword;
  signInWithEmailAndPassword: signInWithEmailAndPassword;
  currentUser: currentUser;
};
