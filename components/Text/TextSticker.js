import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import debounce from 'lodash/debounce';


export default function TextSticker({textSize}){
    const [ text, setText ] = useState('')
    const inputRef = useRef(null);
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scaleText = useSharedValue(textSize)
    const [fontSize, setFontSize] = useState(40);


    const adjustFontSize = debounce((height) => {
        const numberOfLines = Math.floor(height / fontSize); 
    
       
        if (numberOfLines > 5) {
          setFontSize(14); 
        } else if (numberOfLines > 3) {
          setFontSize(20); 
        } else {
          setFontSize(40); 
        }
      }, 500);

      const handleContentSizeChange = (event) => {
        const { height } = event.nativeEvent.contentSize;
        adjustFontSize(height);
      };
   
  

    const handleTextChange = (newText) => {
        setText(newText)
    }
    
    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value
                },
                {
                    translateY: translateY.value
                }
            ]
        }
    })

    
    const drag = Gesture.Pan()
    .onChange((event) => {
        translateX.value += event.changeX;
        translateY.value += event.changeY
    })

    


    return(
        <GestureDetector gesture={drag}>
        <Animated.View
        
        style={[containerStyle, { top: -400, left:10, height: 200, padding:10, width:300}]}>
            <TextInput
             ref={inputRef}
             style={[styles.textInput, { fontSize }]}
             value={text}
             onChangeText={setText}
             multiline={true}
             placeholder="Type here..."
             onContentSizeChange={handleContentSizeChange}
             onBlur={() => adjustFontSize.cancel()} 
            />
        </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      paddingHorizontal: 20,
      flex: 1,
      
      backgroundColor: '#fff',
    },
    textInput: {
      minHeight: 100,
      padding: 10,
    }
  });