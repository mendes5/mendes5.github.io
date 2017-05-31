precision mediump float;
attribute vec3 aPos;
attribute vec2 aUV;
varying vec2 fUV;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
void main(){
    fUV = aUV;
    gl_Position = mProj * mView * mWorld * vec4(aPos, 1.0);
}
    