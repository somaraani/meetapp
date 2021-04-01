import React, { useRef } from "react";
import { Text, View, Dimensions, Animated } from "react-native";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SlidingUpPanel from "rn-sliding-up-panel";

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        justifyContent: "center",
    },
    panel: {
        flex: 1,
        backgroundColor: "white",
        position: "relative",
        bottom: 0,
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 5,

    },
    panelBody: {
        marginLeft: 10,
        marginRight: 10
    },
    closeButton: {
        alignItems: "flex-end"
    }
};



const BottomSheet = ({ panelRef, height, children, twoLevels, onClose }) => {
    const _draggedValue = useRef(new Animated.Value(0));
    const totalHeight = twoLevels ? height * 2 : height;
    const snappingPoints = twoLevels ? [height, height * 2] : [height];

    return (
                <SlidingUpPanel
                showBackdrop={false}
                onBottomReached={() => {
                    onClose && onClose();
                }}
                ref={c => (panelRef.current = c)}
                draggableRange={{ top: totalHeight, bottom: 0 }}
                animatedValue={_draggedValue.current}
                snappingPoints={snappingPoints}
                height={totalHeight}
                friction={0.5}
            >
                <View style={styles.panel}>
                    <Button style={styles.closeButton} onTouchEnd={() => {
                        console.log('close panel')
                        panelRef.current.hide();
                    }}
                    >
                        <Icon name={'close'} color='black' size={20} />
                    </Button>
                    <View style={styles.panelBody}>
                        {children}
                    </View>
                </View>
            </SlidingUpPanel>
    );
}

export default BottomSheet;
