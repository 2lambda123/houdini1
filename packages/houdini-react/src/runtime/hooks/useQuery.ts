import { cache } from '$houdini/runtime'
import { type DocumentArtifact, ArtifactKind } from '$houdini/runtime/lib/types'
import React from 'react'

import { useLiveDocument } from './useLiveDocument'

export function useQuery(artifact: DocumentArtifact, variables: any = null) {
	const [storeValue, observer] = useLiveDocument({
		artifact,
		variables,
	})

	// if we don't have any data in the observer yet, see if we can load from the cache.
	// if we do have the data in the cache then we want to use that value as the result of
	// this hook so we need to use it without going to the network
	let localData = null

	// memoize the cached value so that we only look it up when necessary
	// TODO: this fires _way_ too often in the simple cases. we need to figure out how to prevent
	// unnecessary rerenders.
	const cachedValue = React.useMemo(() => {
		return (
			!storeValue.data &&
			!storeValue.errors &&
			artifact.kind === ArtifactKind.Query &&
			cache.read({ query: { artifact, variables } })
		)
	}, [Boolean(storeValue.data), Boolean(storeValue.errors), artifact.kind, variables])
	if (cachedValue) {
		// TODO: what to do about cache policy here?
		//       we rely on the cache as the way to look up values after suspending (since can't get the resolved values)
		//       if the cache policy doesn't allow us to use cached values, we need _another_ way of getting suspended values

		// if we can't load from the cache then we have to suspend until we can
		// NOTE: this is the bit that prevents infinite suspense loops. By suspending until
		// send() is finished, data won't be null next time we come back here
		//
		// we can't use the cached value if:
		// - it doesn't exist
		// - its partial but the artifact doesn't allow it
		const allowed =
			Boolean(cachedValue.data) &&
			(!cachedValue.partial || (artifact.kind === ArtifactKind.Query && artifact.partial))
		if (!allowed) {
			throw observer.send({ variables })
		}

		// use the cache version for the first non-suspense'd mount of this hook
		localData = cachedValue.data
	}

	// if the store is fetching then we need to suspend until the
	// store is ready for us
	if (storeValue.fetching && observer.pendingPromise) {
		throw observer.pendingPromise
	}

	// by preferring the store value over the local instance we make sure that any
	// updates that show up do not get blocked by the cache read we did when the component
	// mounts
	return [storeValue.data ?? localData]
}
