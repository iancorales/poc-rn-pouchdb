import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRxData } from 'rxdb-hooks';

export const TransactionList = () => {
  
  const queryConstructor = col => col.find()
  
  const { result: transactions, isFetching } = useRxData(
      'transactions',
      queryConstructor
    );

  if (isFetching) {
    return <Text></Text>;
  }

  const deleteTxn = (transaction) => {
    transaction.remove()
  }
  return (
    <View style={{}}>
      <Text style={{marginLeft:10}}>Number of transactions : {transactions.length} </Text>
      <ScrollView >
      {
      transactions?.map((transaction:any,indx : number) => (
         <View style={{padding:10,borderTopWidth:1}}>
            <Text>{indx}) Transaction {transaction.id} </Text>
            <Text>Amount: {transaction.amount} </Text>
            <Text>Type: {transaction.type} </Text>
            <Text>Note: {transaction.note} </Text>
            <TouchableOpacity onPress={()=>deleteTxn(transaction)} style={{borderWidth:1}}><Text>Delete</Text></TouchableOpacity>
        </View>
        )
      )
      }
      </ScrollView>
      
    </View>
  );
};