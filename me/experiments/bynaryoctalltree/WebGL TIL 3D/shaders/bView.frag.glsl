precision lowp float;
uniform sampler2D uSampler;
varying vec2 fTexUV;
void main(){
    gl_FragColor = texture2D(uSampler, fTexUV);
}