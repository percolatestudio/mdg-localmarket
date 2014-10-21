App.info({
  name: 'Local Market',
  description: 'A recipe sharing app made in Meteor.',
  author: 'Percolate Studio Team',
  email: 'us@percolatestudio.com',
  website: 'http://percolatestudio.com',
  version: '0.0.1'
});

App.icons({
  // iOS
  'iphone': 'resources/icons/icon-60x60.png',
  'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  'ipad': 'resources/icons/icon-72x72.png',
  'ipad_2x': 'resources/icons/icon-72x72@2x.png',

  // Android
  'android_ldpi': 'resources/icons/icon-36x36.png',
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
  // iOS
  'iphone': 'resources/splash/splash-320x480.jpg',
  'iphone_2x': 'resources/splash/splash-320x480@2x.jpg',
  'iphone5': 'resources/splash/splash-320x568@2x.jpg',
  'ipad_portrait': 'resources/splash/splash-768x1024.jpg',
  'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.jpg',
  'ipad_landscape': 'resources/splash/splash-1024x768.jpg',
  'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.jpg',

  // Android
  'android_ldpi_portrait': 'resources/splash/splash-200x320.jpg',
  'android_ldpi_landscape': 'resources/splash/splash-320x200.jpg',
  'android_mdpi_portrait': 'resources/splash/splash-320x480.jpg',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.jpg',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.jpg',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.jpg',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.jpg',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.jpg'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');

