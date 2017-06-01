precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mScale;

attribute vec2 aTexUV;
attribute vec4 aPos;

varying vec4 fColor;
varying vec2 fTexUV;

void main(){
    fTexUV = aTexUV;
    gl_PointSize = 4.0;
	gl_Position = mProj * mView * mWorld * mScale * aPos;
}