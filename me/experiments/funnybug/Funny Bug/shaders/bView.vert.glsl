precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec4 aPos;

void main(){
	gl_Position = mProj * mView * mWorld * aPos;
}