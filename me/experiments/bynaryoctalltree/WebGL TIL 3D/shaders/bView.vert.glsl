precision lowp float;
attribute vec2 aPos;
attribute vec2 aTexUV;
varying vec2 fTexUV;
void main(){
    fTexUV = aTexUV;
    gl_Position = vec4(aPos, 1.0, 1.0);
}