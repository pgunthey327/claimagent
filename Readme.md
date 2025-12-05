HardCode your key in autonomous orchestrator line 26
Go to frontend in one terminal - npm run start
Go to mcp-server in one terminal - npm run start
Launch Debugger and start debugging and select server.js process to debug, put breakpoint in autonomousOrchestrator.js line 86

Go to UI give two types of prompt 

Initiate Claim for John Doe and submit - Play debugger until process completes and then see response on UI

Initiate Claim for Selina Kyle and submit - Play debugger until process completes and then see response on UI

Debugger thing is done to avoid any infinite loop as we have limited calls per day.

For RAG each user has Police Report, Gov Site Data and Vehicle Registration Office data(3 files). We can add such data for other users with some missing fields for other use cases, but keep in mind each claim initiate call takes 3 calls to Gen AI, so in 18-20 such initiations you will burn out the Gen AI for that day.

