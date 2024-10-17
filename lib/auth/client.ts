import { organizationClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const client = createAuthClient({
  plugins: [organizationClient(), passkeyClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } // else if (e.error.status === 401) {
      //   toast.error("Unauthorized. Please sign in.");
      // } else if (e.error.status === 403) {
      //   toast.error("Forbidden. Please sign in.");
      // } else if (e.error.status === 404) {
      //   toast.error("Not found. Please try again later.");
      // } else if (e.error.status === 500) {
      //   toast.error("Internal server error. Please try again later.");
      // } else {
      //   toast.error("An error occurred. Please try again later.");
      // }
    }
  }
})

export const {
	signUp,
	signIn,
	signOut,

  session,
	useSession,
	
  user,
	
  organization,
	useListOrganizations,
	useActiveOrganization,
  
  forgetPassword,
  resetPassword,
  
  passkey,
  useListPasskeys,
  
  sendVerificationEmail,
  verifyEmail
} = client;