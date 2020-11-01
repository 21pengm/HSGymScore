import React, { Fragment, useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableWithoutFeedback,
    Keyboard, KeyboardAvoidingView, Platform
} from 'react-native';
import { Button } from 'native-base';

import colors from '../config/colors';
import Layout from '../components/Layout';
import cache from '../utility/cache'

function ResultScreen({ navigation, route }) {
    const [targetScore, setTargetScore] = useState('100');
    const [totalScore, setTotalScore] = useState('100');
    const [otherScore, setOtherScore] = useState('');
    const [otherTeamName, setOtherTeamName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const count = route.params.count;
            const score = await cache.get(`${count}:TargetScore`);
            setTargetScore(score);
            const name = await cache.get('OtherTeamName');
            setOtherTeamName(name);
        }
        if (route.params?.total) {
            const { total } = route.params;
            setTotalScore(total);
        }
        fetchData();
    }, []);

    const showMessage = () => {
        let msg = '';
        if (totalScore && targetScore) {
            msg = parseFloat(totalScore) >= parseFloat(targetScore) ?
                'Congrats, you meet your goal!' :
                "Sorry, maybe next time!";
        }
        return msg;
    }

    const validateScore = (text) => {
        let value = parseFloat(text);
        if (value >= 0 && value < 160) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Layout
            title="Result"
            footer={
                <Fragment>
                    <Button full onPress={() => navigation.navigate('AllEvents',
                        { count: route.params.count })}>
                        <Text> Back </Text>
                    </Button>
                    <Button full onPress={() => navigation.navigate('Home',
                        { count: route.params.count })}>
                        <Text> Home </Text>
                    </Button>
                    <Button full onPress={() => navigation.navigate('Report')}>
                        <Text> Graph </Text>
                    </Button>
                </ Fragment>
            }>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardDismissMode='on-drag'
                style={styles.container}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.container}>
                        <Text style={styles.text}>{'\n'}{'\n'}Goal Score: {targetScore}</Text>
                        <Text style={styles.text}>{'\n'}Total Score: {totalScore}</Text>
                        <Text style={styles.msg}>{'\n'}{'\n'}{showMessage()}</Text>
                        <Text style={styles.text}>{'\n'}{'\n'}-------------------------------------</Text>
                        <Text style={styles.text}>{otherTeamName} Score{'\n'}</Text>
                        <TextInput
                            placeholder={'0.0'}
                            value={otherScore}
                            style={styles.input}
                            keyboardType='numeric'
                            onChangeText={(text) => setOtherScore(text)}
                            onBlur={() => {
                                if (validateScore(otherScore)) {
                                    //storeOtherScore();
                                    if (parseFloat(totalScore) >= parseFloat(otherScore)) {
                                        setMessage('Congrats, you won!');
                                    } else {
                                        setMessage('Sorry, maybe next time!');
                                    }
                                } else {
                                    setOtherScore('');
                                    alert('Invalid score.');
                                }
                            }}
                        />
                        <Text style={styles.msg}>{'\n'}{message}{'\n'}{'\n'}{'\n'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c08189"
    },
    msg: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
    },
    input: {
        alignSelf: "center",
        flexDirection: "row",
        height: 40,
        width: "100%",
        fontSize: 20,
        borderColor: "#333",
        borderBottomWidth: 1,
        padding: 10
    }
});

export default ResultScreen;