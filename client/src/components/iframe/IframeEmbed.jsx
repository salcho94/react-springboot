import React from "react";

const IframeEmbed = ({ src, width = "100%", height = "500px", allowFullScreen = false }) => {
    return (
        <div style={{ width: "100%", overflow: "hidden", borderRadius: "10px", }}>
            <iframe
                src={src}
                width={width}
                height={height}
                allowFullScreen={allowFullScreen}
                style={{ border: "none", width: "100%", height: height }}
                title="Embedded Page"
            />
        </div>
    );
};

export default IframeEmbed;
