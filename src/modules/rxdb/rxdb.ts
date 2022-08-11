import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import SQLite from 'react-native-sqlite-2'
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
import { transactionSchema } from './schema';
const SQLiteAdapter = SQLiteAdapterFactory(SQLite)

addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBReplicationCouchDBPlugin);;
addPouchPlugin(SQLiteAdapter);
addPouchPlugin(require('pouchdb-adapter-http'));

let rxDatabase : RxDatabase;

export const initializeRxDB = async () => {
    console.log('--getRxStoragePouch');
    const storage = getRxStoragePouch('react-native-sqlite') 
    console.log('--createRxDatabase');
    rxDatabase = await createRxDatabase({
        name: 'transactions',
        storage,
        multiInstance: false // <-- Here
    });
    console.log('init collections')
    await initCollections(rxDatabase);
    return rxDatabase;
}

export const initCollections = async (database : RxDatabase) => {
    if(!database.transactions){
        console.log('--addCollections')
        await database.addCollections({
        transactions: {
            schema: transactionSchema
        }});
    }
}


export const syncRxDatabase = async (rxDatabase : RxDatabase) => { 
    try{
        if(!rxDatabase) throw new Error('db not initialized');
        const replicationState = await rxDatabase.transactions.syncCouchDB({
        remote: 'http://192.168.1.3:5984/lista',
        waitForLeadership: false,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
        direction: {                          // direction (optional) to specify sync-directions
            pull: true, // default=true
            push: true  // default=true
        },
        options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
            live: true,
            retry: true
        },
          query: rxDatabase.transactions.find() // query (optional) only documents that match that query will be synchronised
      });
      console.log('-- rxDatabase syncCouchDB', replicationState)
      return replicationState;
    }catch(err: any){
      console.log(err.message);
    }
}



// export const syncLocalToRemote = () => {
//     console.log('--sync. local to remote')
//      try{
//         localDB.sync(remoteDB, {
//           live: true
//         })
//         .on('complete', function () {
//           console.log('--syncLocalToRemote comoplete')
//           Alert.alert('synced from local to remote')
//         })
//         .on('error', function (err:any) {
//           console.log('--syncLocalToRemote error', err )
//         }) 
//         .on('change', function (change:any) {
//           // yo, something changed!
//           console.log('--syncLocalToRemote change' )
//         }).on('error', function (err: any) {
//           // yo, we got an error! (maybe the user went offline?)
//           console.log('--syncLocalToRemote error', err )
//         })
//         .on("error", (err:any) => {
//           //  boo, something went wrong!
//           console.log("--syncLocalToRemote Error data - " + JSON.stringify(err));
//         })
//         .on("paused", (info: any) => {
//           console.log("--syncLocalToRemote sync paulsed data - "+ info);
//         })
//         .on("active", (info: any) => {
//           console.log("--syncLocalToRemote active data - ");
//         })
//         .on("change", (change : any) => {
//           console.log("--syncLocalToRemote something changed data - " + JSON.stringify(change));
//           if (change.docs_read === change.docs_written) {
//             // if (change.docs_read > 600) {
//             //  console.log("Above 1200");
//             //  this.cancelLocationReplication(loc, date);
//           //  }
//             // console.log(change.docs_read, change.docs_written);
//             // console.log("XXXXXXXXXXXXXXXXXXXXXXXX - Resolved");
//           }
//         });
        
//       }catch(err: any){
//         console.log(err.message);
//       }
//   }

// export const syncRemoteToLocal = () => {
//     console.log('--sync. remote to local')
//     remoteDB.replicate.to(localDB)
//     .on('complete', async () => {
//       console.log('--syncRemoteToLocal comoplete')
//       await initializeRxDB()
//       Alert.alert('synced from remote to local')
//     })
//     .on('error', function (err: any) {
//       console.log('--syncRemoteToLocal error', err )
//     }) 
//     .on('change', function (change: any) {
//       // yo, something changed!
//       console.log('--syncLocalToRemote change' )
//     }).on('error', function (err: any) {
//       // yo, we got an error! (maybe the user went offline?)
//       console.log('--syncLocalToRemote error', err )
//     })
//     .on("error", (err : any) => {
//       //  boo, something went wrong!
//       console.log("--syncRemoteToLocal Error data - " + JSON.stringify(err));
//     })
//     .on("paused", (info: any) => {
//       console.log("--syncRemoteToLocal sync paulsed data - "+ info);
//     })
//     .on("active", (info: any) => {
//       console.log("--syncRemoteToLocal active data - ");
//     })
//     .on("change", (change: any) => {
//       console.log("--syncRemoteToLocal something changed data - " + JSON.stringify(change));
//       if (change.docs_read === change.docs_written) {
//         // if (change.docs_read > 600) {
//         //  console.log("Above 1200");
//         //  this.cancelLocationReplication(loc, date);
//       //  }
//         // console.log(change.docs_read, change.docs_written);
//         // console.log("XXXXXXXXXXXXXXXXXXXXXXXX - Resolved");
//       }
//     });
//   }