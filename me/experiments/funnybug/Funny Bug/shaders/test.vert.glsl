precision highp float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mScale;
uniform mat4 mGlobal;

attribute vec2 aTexUV;
attribute vec4 aPos;
attribute vec3 aNormal;

varying vec3 fNormal;
varying vec2 fTexUV;
varying vec3 fPos;

void main(){
    fTexUV = aTexUV;
    gl_PointSize = 4.0;
	fPos = (mWorld * aPos).xyz;
    fNormal = vec3(mWorld * vec4(aNormal, 0.0)).xyz;
	gl_Position = mProj * mView * mGlobal * mWorld * mScale * aPos;
}