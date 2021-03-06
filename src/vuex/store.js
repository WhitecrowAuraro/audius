/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB, getDotPath } from '../utils';
import { getters, actions, mutations, presistMutation, state as initialState } from './audius';
import { state as stateW } from './webScraper/state';
import { state as stateM } from './matrix/state';

Vue.use(Vuex);

function _initModule(state, moduleName, module, savedState, commit) {
	if (savedState) commit(`recoverState_${moduleName}`, savedState);
	// addPresistMutations(moduleName, module.presistMutation);
	Object.assign(
		presistMutation,
		Object.entries(module.presistMutation).reduce(
			(acc, [mutation, presistStates]) =>
				Object.assign(acc, {
					[mutation]: presistStates.map(statePath => `${moduleName}.${statePath}`),
				}),
			{}
		)
	);
	commit('setLoadedModules', moduleName);
}

export const store = new Vuex.Store({
	mutations,
	getters,
	// The state of the submodules also needs to be initialize since otherwise it's not possible
	// to bind to changes in modules
	state: Object.assign({}, initialState, { webScraper: stateW }, { matrix: stateM }),
	actions: Object.assign(actions, {
		initModule({ dispatch, commit, state }, moduleName) {
			if (moduleName in state.loadedModules) return;
			console.log('registerModule', moduleName);
			const savedState = state[moduleName];
			if (moduleName === 'matrix') {
				import(/* webpackChunkName: "vuex/matrix" */ './matrix').then(module => {
					store.registerModule(moduleName, module);
					_initModule(state, moduleName, module, savedState, commit);
					dispatch('initMatrix');
				});
			} else if (moduleName === 'webScraper') {
				import(/* webpackChunkmoduleName: "vuex/webScraper" */ './webScraper').then(module => {
					store.registerModule(moduleName, module);
					_initModule(state, moduleName, module, savedState, commit);
				});
			}
		},
	}),
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				const presistStates =
					mutation.type === 'loadBackup'
						? [
								...new Set(
									Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], [])
								),
							]
						: presistMutation[mutation.type];

				if (presistStates === undefined) return;

				presistStates.forEach(stateName => {
					indexDB
						.writeStore(stateName, getDotPath(state, stateName))
						.then()
						.catch(error => vstore.commit('error', `IndexDB Error ${error}`));
				});
			});
		},
	],
});
