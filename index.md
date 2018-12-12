---
layout: default
---

# Design Goals
##### December 12th, 2018

*   **Beautiful**
*   **Simple**
*   **Cross-Platform**
*   **Performant**
*   **Accurate**

**Beautiful:** The UI for what I consider the most widely used brewing software for homebrewers is terrible. My ultimate goal is to create a complete brewing program to compete with it, but for now Baldr is the first baby-step on that path. It's not 1992 anymore and wxWidgets is a poor choice for a beautiful UI. After weeks of research React Native was chosen as the development tool of choice for this project and its eventual larger brother. It has the ability to look and feel like a native app on the platform you are running it on, with several key advantages on top of that such as the ability to code everything in easy to read JavaScript instead of native code. Later on in the product development it became clear I needed to choose a theme that was not custom hacked together by my vision, but rather it needed to follow [Material Design](https://material.io) and feel like a modern app, such as how UWP apps (Universal Windows Platform) look and feel. The documentation at [material.io](https://material.io) leaves no guesswork to designing a great looking modern app. I got lucky in that two opensource developers had laid the framework to get that done: [React Navigation](https://reactnavigation.org) and [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons). I used to be an engineer, but the app should not look like it was designed by an engineer!

**Simple:** Let's face it, in the heat of a brew day you need a simple UI on a simple platform to make a few quick calculations. All you need to do is input the Brix reading off your refractometer and get the OG. No booting a laptop, running big complex software, finding your bookmarked webpage of an online calculator, wading through menus to find the right spot to do the calculation, or trying to understand what you are looking at. You already have a supercomputer in your pocket ready to go. Baldr should fire up and be ready for your input and then instantly calculate. And let's be honest, you are probably already a few homebrews deep by the time you are taking gravity readings. It needs to be dead simple.

**Cross-Platform:** The orignal software I had in mind was a feature complete brewing solution that would run on Windows and macOS. I bit off more than I could chew, so Baldr was invented just to do gravity calculations. It still needed to run on more than one platform. I decided to restrict it to mobile platforms (even though it can technically run on Windows and macOS too!). Whatever solution I chose, it needed to run on Android and iOS. React Native is the perfect cross-platform solution to accomplish this goal. The same high-level code will run on both and it should look and feel identical, with all the platform-specific features built in. IE: Android and iOS handle input, buttons, navigation, and browser launching tasks a bit different, but it doesn't require two separate software projects to build and maintain. Brilliant!

**Performant:** An app can be as beautiful as a crystal clear lager, but it's worthless if it performs like a stuck fermentation. Developing in purely JavaScript at a high-level has a risk of being non-performant. Luckily the engineers at Facebook have done a great job at making React Native very fast. In pre-alpha testing I finally got to a point where I fired up the performance monitor and it looks like I have a consistent 60fps user experience, despite ugly looking code, several complex calculations happing at realtime in the background and a goal of being beautiful first. The navigation and flow of the app feel great.

**Accurate:** This design goal came later in the product development. It became apparent to me, after searching for the equations to calculate everything, that there were a large number of different equations to do the same calculations, depending on which software you were using. Some software used very simple calculations when a more accurate equation was available. Some software used out of date equations based on old research and information. I was surprised to find that you could get wildly different OG/FG/ABV calculations depending on what software you were using! This quickly became the most time-intensive aspect of the project. I fell all the way down the rabbit hole of brewing science and eventually found the greatest info from Sean Terrill on his awesome blog: [SeanTerrill.com](http://seanterrill.com/). In a future blog post I will detail all the equations that I use in the app and why I chose them.

##### -Matt Mead

* * *
