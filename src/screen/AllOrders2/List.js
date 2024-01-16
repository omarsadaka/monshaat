import React from 'react';
import { FlatList } from 'react-native';

const List = ({
  data,
  getAllMyReuqests,
  onLoadMore,
  REQUEST_LIMIT,
  loadMoreFamilyBtn,
  renderItem,
}) => {
  return (
    <FlatList
      data={data}
      onRefresh={getAllMyReuqests}
      refreshing={false}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id}
      extraData={data}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0}
      initialNumToRender={REQUEST_LIMIT}
      ListFooterComponent={loadMoreFamilyBtn(data)}
    />
  );
};
export default List;
