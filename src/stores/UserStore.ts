import { defineStore } from 'pinia'
import { getJwtToken } from '@/services/authService'
import router from '@/router';
import { isUserAdmin } from '@/services/httpService';




export const useUserStore = defineStore('user', {
  state: () => ({
    jwtToken: sessionStorage.getItem('jwtToken') || '',
    expiresAt: Number(sessionStorage.getItem('expiresAt')) || Date.now(),
    email: sessionStorage.getItem('email') || '',
  }),

  actions: {
    async getTokenAndSaveInStore(email: string, password: string) {
      try {
        const response = await getJwtToken(email, password);

        if (response) {
          console.log('JWT Token received successfully');
          this.jwtToken = response.token;
          this.expiresAt = response.expiration;
          this.email = email;

          sessionStorage.setItem('jwtToken', this.jwtToken);
          sessionStorage.setItem('expiresAt', String(this.expiresAt)); // TODO: maybe remove this line
          sessionStorage.setItem('email', this.email);

          const isAdmin = await isUserAdmin();
          sessionStorage.setItem('isAdmin', String(isAdmin));

          return true;
        } else {
          console.error('Failed to retrieve token');
          return false;
        }
      } catch (err) {
        console.error('Error fetching token:', err);
        throw err;
      }
    },

    logout() {
      console.log('Logging out');
      this.jwtToken = '';
      this.expiresAt = 0;
      this.email = '';
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('expiresAt');
      sessionStorage.removeItem('email');
      router.push('/login');
    },

    //TODO: when you check token, maybe check with backend as well in case user changes their local variables
    isTokenExpired() {
      const currentTime = Date.now();

      if (!this.expiresAt || isNaN(this.expiresAt)) {
        console.warn('Invalid expiration timestamp detected.');
        return true;
      }

      return currentTime > this.expiresAt;
    },

    async refreshTokenIfNeeded() {
      if (this.isTokenExpired()) {
        console.warn('Session expired or expiring soon.');

        // If you implement a refresh token endpoint:
        // try {
        //   const result = await refreshTokenAPI(this.jwtToken);
        //   if (result.success) {
        //     this.jwtToken = result.newToken;
        //     this.expiresAt = result.newExpiresAt;
        //     sessionStorage.setItem('jwtToken', this.jwtToken);
        //     sessionStorage.setItem('expiresAt', String(this.expiresAt));
        //     return;
        //   }
        // } catch (error) {
        //   console.error('Token refresh failed:', error);
        // }

        // If refresh token isn't available or failed, log the user out
        this.logout();
      }
    },

    // Getter method for checking auth state
    isAuthenticated() {
      return !!this.jwtToken && !this.isTokenExpired();
    },

    isUserAdmin() {
      const isAdmin = sessionStorage.getItem('isAdmin');
      return isAdmin === 'true';
    }
  }
});