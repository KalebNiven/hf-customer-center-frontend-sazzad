# Customer Center Frontend

## Live:
- DEV Env: ```https://customer-centr-frontend-dev.healthfirst.org```
- ST Env: ```https://customer-centr-frontend-st.healthfirst.org```

## Instructions:
1. Setup ```.env.client```;
2. ```npm i``` 
3. Use ```npm run build:dev``` to build your changes;
4. Use ```npm run serve``` to run dev environment;
5. App should be accessible on ```localhost:3000``` (if not, look for more details in the terminal);

To run the app with hot reload for development use ```npm run serve```. Your app rebuild and refresh automatically after you save your changes.

## Notes:
1. After you make a change, you have to run ```npm run build:dev``` to build the app so you can serve it with ```npm run dev-serve```.
2. Remember, our backend still runs on ```lofl.test``` so if you have a different setup - adjust your ```MIX_LOFL_API_BASE_URL``` in ```.env.client``` accordingly.

## Deployment:
1. When you merge a PR into ```develop``` the pipiline gets triggered in order to build your changes which should be available live in ```dev``` environment.
2. To merge ```dev``` into ```ST``` you should create a CTASK (same process as before but under ```Customer-Center-Frontend``` repo).

## Trigger Guest Book:
- llaverty 20230907
- llaverty 20231003
- llaverty 20231027
- llaverty 20231115
- llaverty 20231115b
- llaverty 20231115c
- llaverty 20231116
- llaverty 20231121
- llaverty 20231121b



# making update to trigger build
