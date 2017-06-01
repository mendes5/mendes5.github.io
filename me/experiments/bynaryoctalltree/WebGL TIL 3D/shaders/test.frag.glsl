precision mediump float;

uniform int uMode;
uniform sampler2D uSampler1;

uniform vec4 uColor;
varying vec2 fTexUV;

void main(){
    if(uMode == 1){
        gl_FragColor = texture2D(uSampler1, fTexUV);
    }else{
        gl_FragColor = uColor;
    }
}
