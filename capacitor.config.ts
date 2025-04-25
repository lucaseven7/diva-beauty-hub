
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0165d62a798349bc8ec2d5fcd7a9f25f',
  appName: 'Diva Beauty Hub',
  webDir: 'dist',
  server: {
    url: 'https://0165d62a-7983-49bc-8ec2-d5fcd7a9f25f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
