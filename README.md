# Hi there! 

Glad to see you here. 

Recently I had some chances to play around with Google Firestore and Algolia - Firestore function really helps me to build a "backend" with minimum time and money. Not to say there is no learning and struggle at all, I decided to share some of my codes with a broader community. This repo has some functions for adding json data to Firestore, syncing Firestore w/ Algolia, and syncing Firestore collections and docs (hope the file names are self-explanatory enough). I am also planning to write a more detailed medium article, stay tuned. 

Some explanation bc of omitted files:
<li>
  <ul>index_dic = {[schoolName]:{FIRESTORE_INDEX_ID, ALGOLIA_INDEX_NAME, DATA_LOCATION}}</ul>
  <ul>Set up config variables with Algolia keys: $ firebase functions:config:set algolia.appid="YOUR_APP_ID" algolia.apikey="YOUR_API_KEY"</ul>
</li>

If you are interested in the project using these functions, check out some snippets here: https://github.com/SherrieCao/react-native-chat-app-snippets

Cheers! 
