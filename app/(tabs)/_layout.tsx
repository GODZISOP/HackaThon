import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Platform, View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TabRoutes = '/' | '/search' | '/categories' | '/order' | '/profile';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const animatedValue = new Animated.Value(0);

  const handleTabSelect = (index: number, route: TabRoutes) => {
    setSelectedTab(index);
    Animated.spring(animatedValue, {
      toValue: index,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
    router.replace(route); // Type-safe now
  };

  const indicatorPosition = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, width / 5, 2 * width / 5, 3 * width / 5, 4 * width / 5],
  });

  return (
    <>
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Tabs
  screenOptions={{
    tabBarStyle: {
      display: 'none',
    },
    headerShown: false, // <-- Add this line to hide header title
    headerBackground: () =>
      Platform.OS === 'ios' ? (
        <BlurView
          tint="light"
          intensity={95}
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.headerSeparator} />
        </BlurView>
      ) : (
        <View style={styles.androidHeader}>
          <View style={styles.headerSeparator} />
        </View>
      ),
  }}

        tabBar={() => (
          <View style={[styles.customTabBar, { paddingBottom: insets.bottom || 10 }]}>
            <View style={styles.tabContainer}>
              <Animated.View
                style={[
                  styles.indicator,
                  {
                    transform: [{ translateX: indicatorPosition }],
                    width: width / 5,
                  },
                ]}
              >
                <View style={styles.indicatorInner} />
              </Animated.View>

              <TouchableOpacity style={styles.tab} onPress={() => handleTabSelect(0, '/')} activeOpacity={0.7}>
                <View style={[styles.iconWrapper, selectedTab === 0 && styles.activeTab]}>
                  <FontAwesome5 name="home" size={20} color={selectedTab === 0 ? '#3b82f6' : '#94a3b8'} solid={selectedTab === 0} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab} onPress={() => handleTabSelect(1, '/search')} activeOpacity={0.7}>
                <View style={[styles.iconWrapper, selectedTab === 1 && styles.activeTab]}>
                  <FontAwesome5 name="search" size={20} color={selectedTab === 1 ? '#3b82f6' : '#94a3b8'} solid={selectedTab === 1} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab} onPress={() => handleTabSelect(2, '/categories')} activeOpacity={0.7}>
                <View style={[styles.iconWrapper, selectedTab === 2 && styles.activeTab]}>
                  <FontAwesome5 name="th-large" size={20} color={selectedTab === 2 ? '#3b82f6' : '#94a3b8'} solid={selectedTab === 2} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab} onPress={() => handleTabSelect(3, '/order')} activeOpacity={0.7}>
                <View style={[styles.iconWrapper, selectedTab === 3 && styles.activeTab]}>
                  <FontAwesome5 name="shopping-cart" size={20} color={selectedTab === 3 ? '#3b82f6' : '#94a3b8'} solid={selectedTab === 3} />
                  <View style={styles.badge}>
                    <View style={styles.badgeInner} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab} onPress={() => handleTabSelect(4, '/profile')} activeOpacity={0.7}>
                <View style={[styles.iconWrapper, selectedTab === 4 && styles.activeTab]}>
                  <FontAwesome5 name="user" size={20} color={selectedTab === 4 ? '#3b82f6' : '#94a3b8'} solid={selectedTab === 4} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="search" options={{ title: 'Search' }} />
        <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
        <Tabs.Screen name="order" options={{ title: 'Cart' }} />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  androidHeader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  customTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    alignItems: 'center',
  },
  indicatorInner: {
    width: 24,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
});
