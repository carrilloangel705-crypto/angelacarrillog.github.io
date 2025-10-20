"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Lanyard;
var fiber_1 = require("@react-three/fiber");
var meshline_1 = require("meshline");
(0, fiber_1.extend)({ MeshLineGeometry: meshline_1.MeshLineGeometry, MeshLineMaterial: meshline_1.MeshLineMaterial });
/* eslint-disable react/no-unknown-property */
'use client';
var react_1 = require("react");
var fiber_2 = require("@react-three/fiber");
var drei_1 = require("@react-three/drei");
var rapier_1 = require("@react-three/rapier");
var carri_card_png_1 = __importDefault(require("./assets/lanyard/carri_card.png"));
var THREE = __importStar(require("three"));
require("./Lanyard.css");
function Lanyard(_a) {
    var _b = _a.position, position = _b === void 0 ? [0, 0, 30] : _b, _c = _a.gravity, gravity = _c === void 0 ? [0, -40, 0] : _c, _d = _a.fov, fov = _d === void 0 ? 20 : _d, _e = _a.transparent, transparent = _e === void 0 ? true : _e;
    return (React.createElement("div", { className: "lanyard-wrapper" },
        React.createElement(fiber_2.Canvas, { camera: { position: position, fov: fov }, gl: { alpha: transparent }, onCreated: function (_a) {
                var gl = _a.gl;
                return gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
            } },
            React.createElement("ambientLight", { intensity: Math.PI }),
            React.createElement(rapier_1.Physics, { gravity: gravity, timeStep: 1 / 60 },
                React.createElement(Band, null)),
            React.createElement(drei_1.Environment, { blur: 0.75 },
                React.createElement(drei_1.Lightformer, { intensity: 2, color: "white", position: [0, -1, 5], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] }),
                React.createElement(drei_1.Lightformer, { intensity: 3, color: "white", position: [-1, -1, 1], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] }),
                React.createElement(drei_1.Lightformer, { intensity: 3, color: "white", position: [1, 1, 1], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] }),
                React.createElement(drei_1.Lightformer, { intensity: 10, color: "white", position: [-10, 0, 14], rotation: [0, Math.PI / 2, Math.PI / 3], scale: [100, 10, 1] })))));
}
function Band(_a) {
    var _b = _a.maxSpeed, maxSpeed = _b === void 0 ? 50 : _b, _c = _a.minSpeed, minSpeed = _c === void 0 ? 0 : _c;
    var band = (0, react_1.useRef)(null);
    var fixed = (0, react_1.useRef)(null);
    var j1 = (0, react_1.useRef)(null);
    var j2 = (0, react_1.useRef)(null);
    var j3 = (0, react_1.useRef)(null);
    var card = (0, react_1.useRef)(null);
    var vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
    var segmentProps = { type: 'dynamic', canSleep: true, angularDamping: 4, linearDamping: 4 };
    var mapTexture = (0, drei_1.useTexture)(carri_card_png_1.default);
    var lanyardMaterial = new THREE.Texture();
    var curve = (0, react_1.useState)(function () { return new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]); })[0];
    var _d = (0, react_1.useState)(false), dragged = _d[0], drag = _d[1];
    var _e = (0, react_1.useState)(false), hovered = _e[0], hover = _e[1];
    var _f = (0, react_1.useState)(function () { return typeof window !== 'undefined' && window.innerWidth < 1024; }), isSmall = _f[0], setIsSmall = _f[1];
    (0, rapier_1.useRopeJoint)(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    (0, rapier_1.useRopeJoint)(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    (0, rapier_1.useRopeJoint)(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    (0, rapier_1.useSphericalJoint)(j3, card, [
        [0, 0, 0],
        [0, 1.5, 0]
    ]);
    (0, react_1.useEffect)(function () {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return function () { return void (document.body.style.cursor = 'auto'); };
        }
    }, [hovered, dragged]);
    (0, react_1.useEffect)(function () {
        var handleResize = function () {
            setIsSmall(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    (0, fiber_2.useFrame)(function (state, delta) {
        var _a;
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(function (ref) { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.wakeUp(); });
            (_a = card.current) === null || _a === void 0 ? void 0 : _a.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
        }
        if (fixed.current) {
            [j1, j2].forEach(function (ref) {
                if (!ref.current.lerped)
                    ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                var clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(32));
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
        }
    });
    curve.curveType = 'chordal';
    lanyardMaterial.wrapS = lanyardMaterial.wrapT = THREE.RepeatWrapping;
    return (React.createElement(React.Fragment, null,
        React.createElement("group", { position: [0, 4, 0] },
            React.createElement(rapier_1.RigidBody, __assign({ ref: fixed }, segmentProps, { type: "fixed", colliders: false })),
            React.createElement(rapier_1.RigidBody, __assign({ position: [0.5, 0, 0], ref: j1 }, segmentProps, { colliders: "ball" }),
                React.createElement(rapier_1.BallCollider, { args: [0.1] })),
            React.createElement(rapier_1.RigidBody, __assign({ position: [1, 0, 0], ref: j2 }, segmentProps, { colliders: "ball" }),
                React.createElement(rapier_1.BallCollider, { args: [0.1] })),
            React.createElement(rapier_1.RigidBody, __assign({ position: [1.5, 0, 0], ref: j3 }, segmentProps, { colliders: "ball" }),
                React.createElement(rapier_1.BallCollider, { args: [0.1] })),
            React.createElement(rapier_1.RigidBody, __assign({ position: [2, 0, 0], ref: card }, segmentProps, { type: dragged ? 'kinematicPosition' : 'dynamic', colliders: false }),
                React.createElement(rapier_1.CuboidCollider, { args: [0.8, 1.125, 0.01] }),
                React.createElement("mesh", { scale: [1.6, 2.25, 0.02], position: [0, -0.2, 0], onPointerOver: function () { return hover(true); }, onPointerOut: function () { return hover(false); }, onPointerUp: function (e) { return (e.target.releasePointerCapture(e.pointerId), drag(false)); }, onPointerDown: function (e) { return (e.target.setPointerCapture(e.pointerId),
                        drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))); } },
                    React.createElement("boxGeometry", { args: [1, 1, 1] }),
                    React.createElement("meshPhysicalMaterial", { map: mapTexture, "map-anisotropy": 16, clearcoat: 1, clearcoatRoughness: 0.15, roughness: 0.9, metalness: 0.8 })))),
        React.createElement("mesh", { ref: band },
            React.createElement("meshLineGeometry", null),
            React.createElement("meshLineMaterial", { color: "#A0A0A0", depthTest: false, resolution: isSmall ? [1000, 2000] : [1000, 1000], useMap: false, repeat: [-4, 1], lineWidth: 1 }))));
}
