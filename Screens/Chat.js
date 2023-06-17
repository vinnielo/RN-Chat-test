import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList, Button } from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "../components/Modal";
import ChatComponent from "../components/ChatComponent";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({navigation}) => {
	const [visible, setVisible] = useState(false);
	const [rooms, setRooms] = useState([]);

	useLayoutEffect(() => {
		
			fetch("http://192.168.1.2:4000/api")
				.then((res) => res.json())
				.then((data) => {
                    console.log(data);
                    setRooms(data)
                })
				.catch((err) => console.error(err));
		
	}, []);

	const clearAsyncStorage =  () => {
		AsyncStorage.clear();
		navigation.navigate("Login");
	}


	useEffect(() => {
		socket.on("roomsList", (rooms) => {
			setRooms(rooms);
		});
	}, [socket]);

	const handleCreateGroup = () => setVisible(true);

	return (
		<SafeAreaView style={styles.chatscreen}>
			<View style={styles.chattopContainer}>
				<View style={styles.chatheader}>
					<Text style={styles.chatheading}>Chats</Text>
					<Pressable onPress={handleCreateGroup}>
						<Feather name='edit' size={24} color='green' />
					</Pressable>
					<Button title="leave" onPress={clearAsyncStorage} />
						
					
				</View>
			</View>

			<View style={styles.chatlistContainer}>
				{rooms.length > 0 ? (
					<FlatList
						data={rooms}
						renderItem={({ item }) => <ChatComponent item={item} />}
						keyExtractor={(item) => item.id}
					/>
				) : (
					<View style={styles.chatemptyContainer}>
						<Text style={styles.chatemptyText}>No rooms created!</Text>
						<Text>Click the icon above to create a Chat room</Text>
					</View>
				)}
			</View>
			{visible ? <Modal setVisible={setVisible} /> : ""}
		</SafeAreaView>
	);
};

export default Chat;