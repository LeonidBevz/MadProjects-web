import React from "react"
import Loading from "features/shared/components/Loading"

export function withQuery(WrappedComponent, useQueryHook) {
  return function QueryWrapper(props) {
    const { data, isLoading, error } = useQueryHook(props.groupId || props.projectId);
    if (isLoading) {
      return (<div style={{marginBlock: "0.5rem"}}>
            <Loading />
          </div>
      );
    }

    if (error) {
      return <div>{`Ошибка загрузки ${error.status || error.message}`}</div>;
    }

    return <WrappedComponent data={data} {...props} />;
  };
}


