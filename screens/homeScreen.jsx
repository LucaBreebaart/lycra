// HomeScreen.jsx

import { StyleSheet, Text, View, Button, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { handleSignOut } from '../services/authService';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getCompetitionList } from '../services/DbService';
import { getUserDetails } from '../services/DbService';
import LottieView from 'lottie-react-native';

function HomeScreen() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [homeCompetitions, setHomeCompetitions] = useState([]);
  const [recommendedCompetitions, setRecommendedCompetitions] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    setCurrentUser(user);
    if (user) {
      fetchUserDetails(user.uid);
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    const details = await getUserDetails(userId);
    setUserDetails(details);
  };

  const fetchHomeCompetitions = async () => {
    setLoading(true);
    const allCompetitions = await getCompetitionList();
    setHomeCompetitions(allCompetitions.slice(0, 4));
    setLoading(false);
  };

  const fetchRecommendedCompetitions = async () => {
    const allCompetitions = await getCompetitionList();
    setRecommendedCompetitions(allCompetitions.slice(2, 3));
  };

  useEffect(() => {
    fetchHomeCompetitions();
  }, []);

  useEffect(() => {
    fetchRecommendedCompetitions();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            style={styles.animationContainer}
            source={require('../assets/lottie/golf-animation.json')}
            autoPlay
            loop
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerHeading}>The Best Clubs and Competitions here</Text>
            {currentUser && userDetails && (
              <View style={styles.userInfoContainer}>
                <Image source={{ uri: userDetails.profilePhoto }} style={styles.profilePhoto} />
              </View>
            )}
          </View>

          <View style={styles.searchInput}>
            <MaterialIcons
              name='search'
              size={22}
              style={styles.searchIcon}
              color='#F3F3F3'
            />
            <TextInput
              style={styles.inputText}
              placeholder={'I\'m looking for...'}
              placeholderTextColor={'#F3F3F3'}
              underlineColorAndroid={'#fff'}
              autoCorrect={false}
            />
          </View>

        </View>

        <View>

          {recommendedCompetitions.map((competition) => (
            <ImageBackground
              key={competition.id} 
              style={styles.image}
              source={{ uri: "https://images.unsplash.com/photo-1632946269126-0f8edbe8b068?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            >
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 0.30)',
                  'rgba(0, 0, 0, 0.00)',
                  'rgba(0, 0, 0, 0.00)',
                  'rgba(0, 0, 0, 0.50)',
                ]}
                locations={[0.2747, 0.4551, 0.5361, 0.7283]}
                style={{
                  flex: 1,
                  resizeMode: 'cover',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              >

                <View style={styles.imageContainer}>

                  <View style={styles.recommended}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                  <Text style={styles.imageHeading}>{competition.title}</Text>
                  <TouchableOpacity
                    key={competition.id}
                    style={styles.imageButton}
                    onPress={() => navigation.navigate("Details", {
                      CompetitionId: competition.id,
                      CompetitionTitle: competition.title,
                    })}
                  >
                    <Svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="none">
                      <Rect
                        x="0.615385"
                        y="0.615385"
                        width="30.7692"
                        height="30.7692"
                        rx="15.3846"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="2.46 2.46"
                      />
                      <Path
                        d="M11.1446 19.3664C10.9103 19.6007 10.9103 19.9806 11.1446 20.2149C11.3789 20.4492 11.7588 20.4492 11.9931 20.2149L11.1446 19.3664ZM19.729 12.2305C19.729 11.8991 19.4604 11.6305 19.129 11.6305L13.729 11.6305C13.3977 11.6305 13.129 11.8991 13.129 12.2305C13.129 12.5618 13.3977 12.8305 13.729 12.8305L18.529 12.8305L18.529 17.6305C18.529 17.9618 18.7977 18.2305 19.129 18.2305C19.4604 18.2305 19.729 17.9618 19.729 17.6305L19.729 12.2305ZM11.9931 20.2149L19.5533 12.6547L18.7048 11.8062L11.1446 19.3664L11.9931 20.2149Z"
                        fill="white"
                      />
                    </Svg>
                  </TouchableOpacity>

                  <View style={styles.imageDetailsContainer}>

                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <Circle
                        cx="12"
                        cy="12"
                        r="12"
                        transform="matrix(-1 0 0 1 24 0)"
                        fill="#387473"
                      />
                      <Path d="M7.58594 12.8571V6.5C7.58594 6.2643 7.58594 6.14645 7.65916 6.07322C7.73238 6 7.85024 6 8.08594 6H11.4574C11.6618 6 11.764 6 11.8559 6.03806C11.9478 6.07612 12.02 6.14838 12.1645 6.29289L12.4359 6.56425C12.5804 6.70876 12.6527 6.78102 12.7446 6.81908C12.8364 6.85714 12.9386 6.85714 13.143 6.85714H17.3736C17.6455 6.85714 17.7814 6.85714 17.8222 6.94237C17.863 7.0276 17.7778 7.13349 17.6073 7.34526L15.4926 9.97218C15.3716 10.1225 15.3112 10.1976 15.3112 10.2857C15.3112 10.3738 15.3716 10.449 15.4926 10.5992L17.6073 13.2262C17.7778 13.4379 17.863 13.5438 17.8222 13.6291C17.7814 13.7143 17.6455 13.7143 17.3736 13.7143H13.143C12.9386 13.7143 12.8364 13.7143 12.7446 13.6762C12.6527 13.6382 12.5804 13.5659 12.4359 13.4214L12.1645 13.15C12.02 13.0055 11.9478 12.9333 11.8559 12.8952C11.764 12.8571 11.6618 12.8571 11.4574 12.8571H7.58594ZM7.58594 12.8571V18"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </Svg>

                    <Text style={styles.imageDetailsText}>18 Holes</Text>

                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <Circle
                        cx="12"
                        cy="12"
                        r="12"
                        transform="matrix(-1 0 0 1 24 0)"
                        fill="#387473"
                      />
                      <Path
                        d="M14.8016 6.39736C15.0415 6.27906 15.3111 6.23455 15.5762 6.26947C15.8414 6.30438 16.0903 6.41714 16.2914 6.5935C16.4925 6.76985 16.6368 7.00188 16.706 7.26023C16.7752 7.51859 16.7663 7.79167 16.6803 8.04494C16.5943 8.29822 16.4352 8.52031 16.223 8.68314C16.0108 8.84596 15.7551 8.94221 15.4882 8.9597C15.2598 8.97467 15.032 8.9314 14.8259 8.83482C14.8917 8.59527 14.9268 8.34303 14.9268 8.08259C14.9268 7.53719 14.7728 7.02778 14.5058 6.5955C14.5948 6.51712 14.6941 6.45037 14.8016 6.39736ZM13.8315 5.8444C13.9887 5.7048 14.1646 5.58607 14.3552 5.49209C14.7741 5.2855 15.2449 5.20777 15.708 5.26874C16.1711 5.32971 16.6057 5.52664 16.9569 5.83462C17.3081 6.1426 17.5601 6.5478 17.681 6.99899C17.8019 7.45018 17.7862 7.92708 17.6361 8.36939C17.486 8.8117 17.208 9.19956 16.8374 9.48391C16.4669 9.76827 16.0203 9.93635 15.5542 9.9669C15.152 9.99326 14.7509 9.91621 14.3886 9.74456C13.8736 10.4548 13.0371 10.9166 12.0928 10.9166C11.1486 10.9166 10.3123 10.4549 9.79723 9.74495C9.43506 9.91641 9.03415 9.99336 8.6322 9.96702C8.1661 9.93647 7.71953 9.76839 7.34895 9.48404C6.97837 9.19968 6.70044 8.81183 6.55029 8.36951C6.40015 7.9272 6.38454 7.4503 6.50543 6.99911C6.62633 6.54793 6.8783 6.14272 7.22948 5.83474C7.58067 5.52676 8.0153 5.32983 8.4784 5.26886C8.94151 5.20789 9.41229 5.28562 9.83122 5.49222C10.0216 5.5861 10.1974 5.70469 10.3545 5.8441C10.8344 5.47083 11.4376 5.24854 12.0928 5.24854C12.7481 5.24854 13.3514 5.47095 13.8315 5.8444ZM9.68001 6.59509C9.5912 6.51694 9.49204 6.45037 9.3848 6.39748C9.14491 6.27918 8.87533 6.23468 8.61015 6.26959C8.34497 6.3045 8.0961 6.41726 7.895 6.59362C7.69391 6.76997 7.54962 7.002 7.4804 7.26035C7.41117 7.51871 7.42011 7.79179 7.50609 8.04507C7.59206 8.29834 7.75121 8.52043 7.96341 8.68326C8.17561 8.84608 8.43132 8.94233 8.69822 8.95982C8.92633 8.97477 9.15384 8.93162 9.35977 8.83528C9.2939 8.59559 9.25873 8.3432 9.25873 8.08259C9.25873 7.53702 9.41288 7.02746 9.68001 6.59509ZM14.2158 12.1815C16.0253 12.849 16.9206 14.3387 17.3575 15.6082H18.075C18.3847 15.6082 18.5366 15.3633 18.4831 15.1555C18.3109 14.4871 18.0093 13.6517 17.5055 12.9933C17.0126 12.3492 16.3456 11.8942 15.4004 11.8942C14.943 11.8942 14.5525 12.0004 14.2158 12.1815ZM15.4004 10.8848C14.3534 10.8848 13.5452 11.2969 12.9385 11.8798C12.6708 11.847 12.3891 11.8298 12.0927 11.8298C11.7964 11.8298 11.5148 11.847 11.2473 11.8797C10.6406 11.2969 9.83239 10.8848 8.78544 10.8848C7.45084 10.8848 6.51178 11.5526 5.87873 12.3799C5.25656 13.193 4.91234 14.1776 4.72529 14.9037C4.48386 15.8409 5.23825 16.6176 6.11088 16.6176H6.55467C6.53253 16.726 6.5135 16.8299 6.49714 16.9283C6.34753 17.8278 7.08273 18.5073 7.89618 18.5073H16.2892C17.1026 18.5073 17.8378 17.8278 17.6882 16.9283C17.6718 16.8299 17.6528 16.726 17.6307 16.6176H18.075C18.9476 16.6176 19.702 15.8409 19.4605 14.9037C19.2735 14.1776 18.9293 13.193 18.3071 12.3799C17.6741 11.5526 16.735 10.8848 15.4004 10.8848ZM5.70274 15.1555C5.87492 14.4871 6.17653 13.6517 6.68032 12.9933C7.17324 12.3492 7.84027 11.8942 8.78544 11.8942C9.24276 11.8942 9.6332 12.0003 9.96987 12.1814C8.16019 12.8488 7.26484 14.3386 6.82795 15.6082H6.11088C5.80114 15.6082 5.64921 15.3633 5.70274 15.1555ZM8.61137 14.3765C7.92259 15.2473 7.62141 16.3208 7.49283 17.0939C7.46135 17.2831 7.60587 17.4979 7.89618 17.4979H16.2892C16.5795 17.4979 16.724 17.2831 16.6925 17.0939C16.5639 16.3208 16.2627 15.2473 15.574 14.3765C14.9033 13.5286 13.8409 12.8392 12.0927 12.8392C10.3445 12.8392 9.28205 13.5286 8.61137 14.3765ZM13.9175 8.08259C13.9175 9.09034 13.1005 9.90728 12.0928 9.90728C11.085 9.90728 10.2681 9.09034 10.2681 8.08259C10.2681 7.07484 11.085 6.2579 12.0928 6.2579C13.1005 6.2579 13.9175 7.07484 13.9175 8.08259Z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        fill="white"
                      />
                    </Svg>

                    <Text style={styles.imageDetailsText}>13 Players</Text>

                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <Circle
                        cx="12"
                        cy="12"
                        r="12"
                        transform="matrix(-1 0 0 1 24 0)"
                        fill="#387473"
                      />
                      <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.42861 5.40002C9.75999 5.40002 10.0286 5.66865 10.0286 6.00002V7.11426H13.9712V6.00002C13.9712 5.66865 14.2398 5.40002 14.5712 5.40002C14.9026 5.40002 15.1712 5.66865 15.1712 6.00002V7.11551C15.5633 7.11828 15.9024 7.12712 16.1938 7.15538C16.6338 7.19805 17.0277 7.28939 17.3832 7.51277C17.5486 7.61668 17.7012 7.73855 17.8384 7.87578C17.9756 8.01301 18.0975 8.16561 18.2014 8.33097C18.4248 8.68649 18.5161 9.08033 18.5588 9.52036C18.5999 9.94454 18.5999 10.47 18.5999 11.1127V11.1428H18.5993C18.5999 11.3119 18.5999 11.4877 18.5999 11.6701V11.6703V11.6704V11.6713V11.7143V14V14.0429C18.5999 14.9492 18.5999 15.6898 18.5213 16.2745C18.4392 16.8856 18.2613 17.4155 17.8384 17.8384C17.4154 18.2614 16.8856 18.4392 16.2744 18.5214C15.6897 18.6 14.9491 18.6 14.0429 18.6H13.9999H9.9999H9.95695C9.05069 18.6 8.3101 18.6 7.72541 18.5214C7.11425 18.4392 6.58438 18.2614 6.16143 17.8384C5.73847 17.4155 5.56065 16.8856 5.47848 16.2745C5.39987 15.6898 5.39988 14.9492 5.3999 14.0429V14.0429V14V11.7143V11.6713V11.6713C5.3999 11.4884 5.3999 11.3123 5.40054 11.1428H5.3999V11.1127V11.1127C5.39989 10.47 5.39989 9.94454 5.44102 9.52036C5.4837 9.08033 5.57504 8.68649 5.79842 8.33097C6.00623 8.00024 6.28589 7.72059 6.61662 7.51277C6.97213 7.28939 7.36597 7.19805 7.806 7.15538C8.09736 7.12712 8.43652 7.11828 8.82861 7.11551L8.82861 6.00002C8.82861 5.66865 9.09724 5.40002 9.42861 5.40002ZM13.9712 8.31426V8.57145C13.9712 8.90282 14.2398 9.17145 14.5712 9.17145C14.9026 9.17145 15.1712 8.90282 15.1712 8.57145V8.32181C15.5449 8.32997 15.8526 8.34692 16.1145 8.38213C16.5926 8.44641 16.827 8.56148 16.9899 8.72431C17.1527 8.88714 17.2678 9.12157 17.332 9.59966C17.3672 9.8615 17.3842 10.1692 17.3923 10.5428H6.60746C6.61562 10.1692 6.63257 9.8615 6.66778 9.59966C6.73206 9.12157 6.84712 8.88714 7.00995 8.72431C7.17279 8.56148 7.40721 8.44641 7.88531 8.38213C8.14717 8.34692 8.4549 8.32997 8.82861 8.32181V8.57145C8.82861 8.90282 9.09724 9.17145 9.42861 9.17145C9.75999 9.17145 10.0286 8.90282 10.0286 8.57145V8.31426H13.9712ZM17.3999 11.7428H6.5999V14C6.5999 14.9597 6.60118 15.6192 6.66778 16.1146C6.73206 16.5927 6.84712 16.8271 7.00995 16.9899C7.17279 17.1528 7.40721 17.2678 7.88531 17.3321C8.38066 17.3987 9.04013 17.4 9.9999 17.4H13.9999C14.9597 17.4 15.6191 17.3987 16.1145 17.3321C16.5926 17.2678 16.827 17.1528 16.9899 16.9899C17.1527 16.8271 17.2678 16.5927 17.332 16.1146C17.3986 15.6192 17.3999 14.9597 17.3999 14V11.7428ZM10.2855 13.9714C9.95418 13.9714 9.68555 14.2401 9.68555 14.5714C9.68555 14.9028 9.95418 15.1714 10.2855 15.1714H13.7141C14.0455 15.1714 14.3141 14.9028 14.3141 14.5714C14.3141 14.2401 14.0455 13.9714 13.7141 13.9714H10.2855Z"
                        fill="white"
                      />
                    </Svg>

                    <Text style={styles.imageDetailsText}>{competition.date.split(',')[1].trim()}</Text>

                  </View>

                </View>

              </LinearGradient>

            </ImageBackground>
          ))}
          <View style={styles.btnContainer}>

            <View style={styles.coursesBtn}>
              <Image
                style={styles.coursesBtnImage}
                source={require('../assets/images/golf-course-image.png')}
              >
              </Image>
              <Text style={styles.coursesBtnHeading}>Courses</Text>
              <Text style={styles.coursesBtnSubHeading}>view all</Text>

              <Svg width={40} height={40} viewBox="0 0 32 32" fill="none" style={styles.courseIcon}>
                <Rect
                  x="0.615385"
                  y="0.615385"
                  width="30.7692"
                  height="30.7692"
                  rx="15.3846"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="2.46 2.46"
                />
                <Path
                  d="M11.1446 19.3664C10.9103 19.6007 10.9103 19.9806 11.1446 20.2149C11.3789 20.4492 11.7588 20.4492 11.9931 20.2149L11.1446 19.3664ZM19.729 12.2305C19.729 11.8991 19.4604 11.6305 19.129 11.6305L13.729 11.6305C13.3977 11.6305 13.129 11.8991 13.129 12.2305C13.129 12.5618 13.3977 12.8305 13.729 12.8305L18.529 12.8305L18.529 17.6305C18.529 17.9618 18.7977 18.2305 19.129 18.2305C19.4604 18.2305 19.729 17.9618 19.729 17.6305L19.729 12.2305ZM11.9931 20.2149L19.5533 12.6547L18.7048 11.8062L11.1446 19.3664L11.9931 20.2149Z"
                  fill="black"
                />
              </Svg>


            </View>

            <View style={styles.btnContainer2}>

              <View style={styles.coursesBtn2}>

                <Svg width={16} height={22} viewBox="0 0 16 22" fill="none" style={styles.courseIcon}>
                  <Path
                    d="M3.3401 1.25C2.18658 1.25 1.25146 2.18512 1.25146 3.33864V18.1749C1.25146 20.0991 3.63277 20.9997 4.90604 19.5571L7.56022 16.5499C7.79455 16.2844 8.20855 16.2844 8.44288 16.5499L11.0971 19.5571C12.3703 20.9997 14.7516 20.0991 14.7516 18.1749V3.33864C14.7516 2.18512 13.8165 1.25 12.663 1.25H3.3401Z"
                    stroke="black"
                    strokeWidth={1.5}
                  />
                </Svg>

                <Text style={styles.coursesBtnSubHeading}>Saved</Text>

              </View>

              <View style={styles.coursesBtn3}>

                <Svg width={20} height={22} viewBox="0 0 20 22" fill="none" style={styles.courseIcon}>
                  <Path
                    d="M1.64453 12.4286V1.83333C1.64453 1.4405 1.64453 1.24408 1.76657 1.12204C1.88861 1 2.08503 1 2.47786 1H8.09703C8.43766 1 8.60797 1 8.76111 1.06343C8.91426 1.12687 9.03468 1.2473 9.27554 1.48816L9.7278 1.94042C9.96866 2.18127 10.0891 2.3017 10.2422 2.36514C10.3954 2.42857 10.5657 2.42857 10.9063 2.42857H17.9573C18.4104 2.42857 18.637 2.42857 18.705 2.57062C18.773 2.71266 18.6309 2.88914 18.3468 3.2421L14.8223 7.6203C14.6207 7.87076 14.5199 7.99599 14.5199 8.14286C14.5199 8.28973 14.6207 8.41496 14.8223 8.66541L18.3468 13.0436C18.6309 13.3966 18.773 13.5731 18.705 13.7151C18.637 13.8571 18.4104 13.8571 17.9573 13.8571H10.9063C10.5657 13.8571 10.3954 13.8571 10.2422 13.7937C10.0891 13.7303 9.96866 13.6098 9.7278 13.369L9.27554 12.9167C9.03468 12.6759 8.91426 12.5554 8.76111 12.492C8.60797 12.4286 8.43766 12.4286 8.09703 12.4286H1.64453ZM1.64453 12.4286V21"
                    stroke="black"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </Svg>

                <Text style={styles.coursesBtnSubHeading}>Current Games</Text>

              </View>

            </View>

          </View>


          <View style={styles.discoverContainer}>
            <Text style={styles.discoverHeading}>Discover</Text>
            <Text style={styles.discoverCourseSubHeading}>View competitions below</Text>
          </View>


          <View>

            {homeCompetitions.map((competition) => (
              <View key={competition.id}>

                <View style={styles.discoverCourseContainer}>

                  <TouchableOpacity
                    key={competition.id}
                    onPress={() => navigation.navigate("Details", {
                      CompetitionId: competition.id,
                      CompetitionTitle: competition.title,
                    })}
                  >
                    <Text style={styles.discoverHeading}>{competition.title}</Text>

                    <View style={styles.discoverImageContainer}>

                      <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <Circle
                          cx="12"
                          cy="12"
                          r="12"
                          transform="matrix(-1 0 0 1 24 0)"
                          fill="#387473"
                        />
                        <Path d="M7.58594 12.8571V6.5C7.58594 6.2643 7.58594 6.14645 7.65916 6.07322C7.73238 6 7.85024 6 8.08594 6H11.4574C11.6618 6 11.764 6 11.8559 6.03806C11.9478 6.07612 12.02 6.14838 12.1645 6.29289L12.4359 6.56425C12.5804 6.70876 12.6527 6.78102 12.7446 6.81908C12.8364 6.85714 12.9386 6.85714 13.143 6.85714H17.3736C17.6455 6.85714 17.7814 6.85714 17.8222 6.94237C17.863 7.0276 17.7778 7.13349 17.6073 7.34526L15.4926 9.97218C15.3716 10.1225 15.3112 10.1976 15.3112 10.2857C15.3112 10.3738 15.3716 10.449 15.4926 10.5992L17.6073 13.2262C17.7778 13.4379 17.863 13.5438 17.8222 13.6291C17.7814 13.7143 17.6455 13.7143 17.3736 13.7143H13.143C12.9386 13.7143 12.8364 13.7143 12.7446 13.6762C12.6527 13.6382 12.5804 13.5659 12.4359 13.4214L12.1645 13.15C12.02 13.0055 11.9478 12.9333 11.8559 12.8952C11.764 12.8571 11.6618 12.8571 11.4574 12.8571H7.58594ZM7.58594 12.8571V18"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </Svg>

                      <Text style={styles.imageDetailsText}>18 Holes</Text>

                      <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <Circle
                          cx="12"
                          cy="12"
                          r="12"
                          transform="matrix(-1 0 0 1 24 0)"
                          fill="#387473"
                        />
                        <Path
                          d="M14.8016 6.39736C15.0415 6.27906 15.3111 6.23455 15.5762 6.26947C15.8414 6.30438 16.0903 6.41714 16.2914 6.5935C16.4925 6.76985 16.6368 7.00188 16.706 7.26023C16.7752 7.51859 16.7663 7.79167 16.6803 8.04494C16.5943 8.29822 16.4352 8.52031 16.223 8.68314C16.0108 8.84596 15.7551 8.94221 15.4882 8.9597C15.2598 8.97467 15.032 8.9314 14.8259 8.83482C14.8917 8.59527 14.9268 8.34303 14.9268 8.08259C14.9268 7.53719 14.7728 7.02778 14.5058 6.5955C14.5948 6.51712 14.6941 6.45037 14.8016 6.39736ZM13.8315 5.8444C13.9887 5.7048 14.1646 5.58607 14.3552 5.49209C14.7741 5.2855 15.2449 5.20777 15.708 5.26874C16.1711 5.32971 16.6057 5.52664 16.9569 5.83462C17.3081 6.1426 17.5601 6.5478 17.681 6.99899C17.8019 7.45018 17.7862 7.92708 17.6361 8.36939C17.486 8.8117 17.208 9.19956 16.8374 9.48391C16.4669 9.76827 16.0203 9.93635 15.5542 9.9669C15.152 9.99326 14.7509 9.91621 14.3886 9.74456C13.8736 10.4548 13.0371 10.9166 12.0928 10.9166C11.1486 10.9166 10.3123 10.4549 9.79723 9.74495C9.43506 9.91641 9.03415 9.99336 8.6322 9.96702C8.1661 9.93647 7.71953 9.76839 7.34895 9.48404C6.97837 9.19968 6.70044 8.81183 6.55029 8.36951C6.40015 7.9272 6.38454 7.4503 6.50543 6.99911C6.62633 6.54793 6.8783 6.14272 7.22948 5.83474C7.58067 5.52676 8.0153 5.32983 8.4784 5.26886C8.94151 5.20789 9.41229 5.28562 9.83122 5.49222C10.0216 5.5861 10.1974 5.70469 10.3545 5.8441C10.8344 5.47083 11.4376 5.24854 12.0928 5.24854C12.7481 5.24854 13.3514 5.47095 13.8315 5.8444ZM9.68001 6.59509C9.5912 6.51694 9.49204 6.45037 9.3848 6.39748C9.14491 6.27918 8.87533 6.23468 8.61015 6.26959C8.34497 6.3045 8.0961 6.41726 7.895 6.59362C7.69391 6.76997 7.54962 7.002 7.4804 7.26035C7.41117 7.51871 7.42011 7.79179 7.50609 8.04507C7.59206 8.29834 7.75121 8.52043 7.96341 8.68326C8.17561 8.84608 8.43132 8.94233 8.69822 8.95982C8.92633 8.97477 9.15384 8.93162 9.35977 8.83528C9.2939 8.59559 9.25873 8.3432 9.25873 8.08259C9.25873 7.53702 9.41288 7.02746 9.68001 6.59509ZM14.2158 12.1815C16.0253 12.849 16.9206 14.3387 17.3575 15.6082H18.075C18.3847 15.6082 18.5366 15.3633 18.4831 15.1555C18.3109 14.4871 18.0093 13.6517 17.5055 12.9933C17.0126 12.3492 16.3456 11.8942 15.4004 11.8942C14.943 11.8942 14.5525 12.0004 14.2158 12.1815ZM15.4004 10.8848C14.3534 10.8848 13.5452 11.2969 12.9385 11.8798C12.6708 11.847 12.3891 11.8298 12.0927 11.8298C11.7964 11.8298 11.5148 11.847 11.2473 11.8797C10.6406 11.2969 9.83239 10.8848 8.78544 10.8848C7.45084 10.8848 6.51178 11.5526 5.87873 12.3799C5.25656 13.193 4.91234 14.1776 4.72529 14.9037C4.48386 15.8409 5.23825 16.6176 6.11088 16.6176H6.55467C6.53253 16.726 6.5135 16.8299 6.49714 16.9283C6.34753 17.8278 7.08273 18.5073 7.89618 18.5073H16.2892C17.1026 18.5073 17.8378 17.8278 17.6882 16.9283C17.6718 16.8299 17.6528 16.726 17.6307 16.6176H18.075C18.9476 16.6176 19.702 15.8409 19.4605 14.9037C19.2735 14.1776 18.9293 13.193 18.3071 12.3799C17.6741 11.5526 16.735 10.8848 15.4004 10.8848ZM5.70274 15.1555C5.87492 14.4871 6.17653 13.6517 6.68032 12.9933C7.17324 12.3492 7.84027 11.8942 8.78544 11.8942C9.24276 11.8942 9.6332 12.0003 9.96987 12.1814C8.16019 12.8488 7.26484 14.3386 6.82795 15.6082H6.11088C5.80114 15.6082 5.64921 15.3633 5.70274 15.1555ZM8.61137 14.3765C7.92259 15.2473 7.62141 16.3208 7.49283 17.0939C7.46135 17.2831 7.60587 17.4979 7.89618 17.4979H16.2892C16.5795 17.4979 16.724 17.2831 16.6925 17.0939C16.5639 16.3208 16.2627 15.2473 15.574 14.3765C14.9033 13.5286 13.8409 12.8392 12.0927 12.8392C10.3445 12.8392 9.28205 13.5286 8.61137 14.3765ZM13.9175 8.08259C13.9175 9.09034 13.1005 9.90728 12.0928 9.90728C11.085 9.90728 10.2681 9.09034 10.2681 8.08259C10.2681 7.07484 11.085 6.2579 12.0928 6.2579C13.1005 6.2579 13.9175 7.07484 13.9175 8.08259Z"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          fill="white"
                        />
                      </Svg>

                      <Text style={styles.imageDetailsText}>13 Players</Text>

                      <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <Circle
                          cx="12"
                          cy="12"
                          r="12"
                          transform="matrix(-1 0 0 1 24 0)"
                          fill="#387473"
                        />
                        <Path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.42861 5.40002C9.75999 5.40002 10.0286 5.66865 10.0286 6.00002V7.11426H13.9712V6.00002C13.9712 5.66865 14.2398 5.40002 14.5712 5.40002C14.9026 5.40002 15.1712 5.66865 15.1712 6.00002V7.11551C15.5633 7.11828 15.9024 7.12712 16.1938 7.15538C16.6338 7.19805 17.0277 7.28939 17.3832 7.51277C17.5486 7.61668 17.7012 7.73855 17.8384 7.87578C17.9756 8.01301 18.0975 8.16561 18.2014 8.33097C18.4248 8.68649 18.5161 9.08033 18.5588 9.52036C18.5999 9.94454 18.5999 10.47 18.5999 11.1127V11.1428H18.5993C18.5999 11.3119 18.5999 11.4877 18.5999 11.6701V11.6703V11.6704V11.6713V11.7143V14V14.0429C18.5999 14.9492 18.5999 15.6898 18.5213 16.2745C18.4392 16.8856 18.2613 17.4155 17.8384 17.8384C17.4154 18.2614 16.8856 18.4392 16.2744 18.5214C15.6897 18.6 14.9491 18.6 14.0429 18.6H13.9999H9.9999H9.95695C9.05069 18.6 8.3101 18.6 7.72541 18.5214C7.11425 18.4392 6.58438 18.2614 6.16143 17.8384C5.73847 17.4155 5.56065 16.8856 5.47848 16.2745C5.39987 15.6898 5.39988 14.9492 5.3999 14.0429V14.0429V14V11.7143V11.6713V11.6713C5.3999 11.4884 5.3999 11.3123 5.40054 11.1428H5.3999V11.1127V11.1127C5.39989 10.47 5.39989 9.94454 5.44102 9.52036C5.4837 9.08033 5.57504 8.68649 5.79842 8.33097C6.00623 8.00024 6.28589 7.72059 6.61662 7.51277C6.97213 7.28939 7.36597 7.19805 7.806 7.15538C8.09736 7.12712 8.43652 7.11828 8.82861 7.11551L8.82861 6.00002C8.82861 5.66865 9.09724 5.40002 9.42861 5.40002ZM13.9712 8.31426V8.57145C13.9712 8.90282 14.2398 9.17145 14.5712 9.17145C14.9026 9.17145 15.1712 8.90282 15.1712 8.57145V8.32181C15.5449 8.32997 15.8526 8.34692 16.1145 8.38213C16.5926 8.44641 16.827 8.56148 16.9899 8.72431C17.1527 8.88714 17.2678 9.12157 17.332 9.59966C17.3672 9.8615 17.3842 10.1692 17.3923 10.5428H6.60746C6.61562 10.1692 6.63257 9.8615 6.66778 9.59966C6.73206 9.12157 6.84712 8.88714 7.00995 8.72431C7.17279 8.56148 7.40721 8.44641 7.88531 8.38213C8.14717 8.34692 8.4549 8.32997 8.82861 8.32181V8.57145C8.82861 8.90282 9.09724 9.17145 9.42861 9.17145C9.75999 9.17145 10.0286 8.90282 10.0286 8.57145V8.31426H13.9712ZM17.3999 11.7428H6.5999V14C6.5999 14.9597 6.60118 15.6192 6.66778 16.1146C6.73206 16.5927 6.84712 16.8271 7.00995 16.9899C7.17279 17.1528 7.40721 17.2678 7.88531 17.3321C8.38066 17.3987 9.04013 17.4 9.9999 17.4H13.9999C14.9597 17.4 15.6191 17.3987 16.1145 17.3321C16.5926 17.2678 16.827 17.1528 16.9899 16.9899C17.1527 16.8271 17.2678 16.5927 17.332 16.1146C17.3986 15.6192 17.3999 14.9597 17.3999 14V11.7428ZM10.2855 13.9714C9.95418 13.9714 9.68555 14.2401 9.68555 14.5714C9.68555 14.9028 9.95418 15.1714 10.2855 15.1714H13.7141C14.0455 15.1714 14.3141 14.9028 14.3141 14.5714C14.3141 14.2401 14.0455 13.9714 13.7141 13.9714H10.2855Z"
                          fill="white"
                        />
                      </Svg>

                      <Text style={styles.imageDetailsText}>
                        {competition.date.split(',')[1].trim()}
                      </Text>
                    </View>

                  </TouchableOpacity>

                </View>

                <ImageBackground
                  style={styles.discoverImage}
                  source={{ uri: competition.image }}
                >
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.10)']}
                    locations={[0.2747, 0.4551, 0.5361, 0.7283]}
                    style={{
                      flex: 1,
                      resizeMode: 'cover',
                      justifyContent: 'center',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                  </LinearGradient>
                </ImageBackground>

              </View>

            ))}

          </View>

        </View>

      </View >

    </ScrollView >
  );

}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: '#F4FDFD',
    gap: 10,
  },
  headerContainer: {
    width: '100%',
    height: 'auto',
    top: 0,
    backgroundColor: '#246362',
    paddingHorizontal: 20,
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 70,
    borderRadius: 12,
  },
  header: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerHeading: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Inter',
    width: 220,
  },
  headerSubHeading: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Michroma'
  },
  searchInput: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    gap: 10,
    padding: 15,
    width: '100%',
  },
  inputText: {

  },
  image: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',

  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 20,
    gap: 10,
  },
  recommended: {
    borderRadius: 10,
    backgroundColor: 'rgba(111, 111, 111, 0.33)',
    height: 35,
    width: 150,
    paddingVertical: 1,
    paddingHorizontal: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedText: {
    color: 'white',
    fontSize: 18,
    color: 'white',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  imageHeading: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'Michroma',
    lineHeight: 40,
    overflow: 'visible',
  },
  imageButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  imageDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  imageDetailsText: {
    color: 'white',
    fontSize: 18,
    color: 'white',
    fontFamily: 'Inter',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginVertical: 10,
  },
  btnContainer2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 10,
  },
  coursesBtn: {
    height: 200,
    width: '50%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#D7E072',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'relative',
    padding: 20,
    gap: 10,
  },
  coursesBtnImage: {
    position: 'absolute',
    width: '150%',
    height: '150%',
  },
  coursesBtn2: {
    height: 95,
    width: '50%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#A6DBDA',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'relative',
    padding: 20,
    gap: 10,
  },
  coursesBtn3: {
    height: 95,
    width: '50%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#A6BBDB',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'relative',
    padding: 20,
    gap: 10,
  },
  courseIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  coursesBtnHeading: {
    fontSize: 26,
    color: 'black',
    fontFamily: 'Michroma',
    lineHeight: 26,
    overflow: 'visible',
  },
  coursesBtnSubHeading: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
    fontFamily: 'inter',
    lineHeight: 22,
    overflow: 'visible',
  },
  discoverContainer: {
    width: '100%',
    height: 'auto',
    top: 0,
    backgroundColor: '#246362',
    paddingHorizontal: 20,
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 12,
    gap: 5,
  },
  discoverHeading: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'Michroma',
    lineHeight: 40,
    overflow: 'visible',
  },
  discoverCourseContainer: {
    width: '100%',
    height: 'auto',
    top: 0,
    backgroundColor: '#246362',
    paddingHorizontal: 20,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 12,
    marginVertical: 10,
  },
  discoverCourseHeading: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'Michroma',
    lineHeight: 40,
    overflow: 'visible',
  },
  discoverCourseSubHeading: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Michroma'
  },
  discoverImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  discoverImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: 'auto',
    gap: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    width: '100%',
    backgroundColor: '#F4FDFD',
  },
  animationContainer: {
    width: 200,
    height: 200,
  },
  profilePhoto: {
    width: 70,
    height: 70,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 12,
  },

});
