/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState} from 'react';
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PouchDB from './src/modules/pouchdb/pouchdb'
import { initializeRxDB, syncRxDatabase } from './src/modules/rxdb/rxdb';
import { RxDatabase } from 'rxdb';
import { Provider } from 'rxdb-hooks';
import { TransactionList } from './src/components';

 
const App = () => {
  // const [localDB,setLocalDB] = useState<any>(); 
  const [rxDB,setRxDB] = useState<RxDatabase>(); 

  const boot = async () => {
    console.log('-- initialize pouchdb');  
    const dbPouch =new PouchDB('transactions.db', { adapter: 'react-native-sqlite' , live: true, skip_setup: true})
    // setLocalDB(dbPouch);

    console.log('-- initialize rxdb')
    const rxDatabase = await initializeRxDB()
    setRxDB(rxDatabase);

    console.log('-- initialize rxdb')
    await syncRxDatabase(rxDatabase)

    console.log('-- boot ok')
  }
    
  const insertTransaction = async () => {
     try{
      if(!rxDB) throw new Error('db not initialized');
      // for(let index=0;index<18000;index++){

        const index = Math.random() * 2.5;
        await rxDB.transactions.insert({
         id : new Date().valueOf().toString(),
          amount: new Date().valueOf()/200,
          note: 'test ' + new Date().valueOf()/32,
          isPOS : Math.random() < 0.5,
          idCustomer: index+'-customer',
          idBusiness: index+'-business',
          idStore: index+'customer',
          type: index % 2 ? 'SALE' : 'EXPENSE'
        });

      // }
        
        
    }catch(err: any){
      console.log(err.message);
    }
  }
 

  const bulkInsertTransaction = async () => {
    try {
      if(!rxDB) throw new Error('db not initialized');
      let array = []
      for(let index=0;index< 50; index++){
        array.push({
          _id : 'transactions',
          id : new Date().valueOf().toString(),
          amount: new Date().valueOf()/200,
          note: 'test ' + new Date().valueOf()/32,
          isPOS : Math.random() < 0.5,
          idCustomer: index+'-customer',
          idBusiness: index+'-business',
          idStore: index+'customer',
          type: index % 2 ? 'SALE' : 'EXPENSE'
        })
      }
      console.log('--bulk insert..')
      await rxDB.transactions.bulkInsert(array);
      console.log('--done')
    } catch (err : any) {
      Alert.alert(err.message)
    } 
  }

  return (
     <Provider db={rxDB}>
      <View style={{padding:10}}>
        <Text>Hello - Test app</Text>
        <View style={{padding:10}}>
          <TouchableOpacity onPress={boot} style={{borderWidth:1}}><Text>Start</Text></TouchableOpacity>
          <TouchableOpacity onPress={insertTransaction} style={{borderWidth:1}}><Text>Insert transaction</Text></TouchableOpacity>
          <TouchableOpacity onPress={bulkInsertTransaction} style={{borderWidth:1}}><Text>Bulk transaction insert (1000)</Text></TouchableOpacity>
          <Text>Is loaded ? : {rxDB?.transactions  ? 'yes' : 'no'}</Text>  
        </View>
        {/* TRANSACTION LIST TEST */}
      </View>
      <TransactionList/>  
     </Provider>
  );
}; 

export default App;
