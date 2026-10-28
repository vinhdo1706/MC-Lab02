import { DEMO_ACCOUNT } from '../data/demoAccount';
import type { FitnessMember } from '../types';

export async function loginWithUsernamePassword(
  username: string,
  password: string,
): Promise<FitnessMember | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  const isValid =
    username.trim() === DEMO_ACCOUNT.username &&
    password === DEMO_ACCOUNT.password;

  return isValid ? DEMO_ACCOUNT.profile : null;
}
