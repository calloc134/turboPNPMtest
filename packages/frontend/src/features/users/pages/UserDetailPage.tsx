import { useQuery } from "urql";
import { useParams } from "@tanstack/react-router";
import { Spinner } from "@nextui-org/react";
import { graphql } from "src/lib/generated/gql";
import { UserDetailCard } from "../components/UserDetailCard";

// クエリするフラグメントを定義
const UserDetailFragment = graphql(`
  query UserDetailFragment($uuid: UUID!) {
    getUserByUUID(uuid: $uuid) {
      ...UserDetailFragment
    }
  }
`);

const UserDetailPage = () => {
  // URLパラメータよりユーザーのUUIDを取得
  const user_uuid = useParams({
    from: "/auth/users/$user_uuid",
  })?.user_uuid;

  // クエリを行ってユーザーの情報を取得
  const [result] = useQuery({
    query: UserDetailFragment,
    variables: {
      uuid: user_uuid,
    },
  });

  // クエリの結果を取得
  const { data, fetching } = result;

  // ローディング中であれば
  if (fetching)
    return (
      <div className="flex items-center justify-center">
        <Spinner label="読み込み中..." color="warning" />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex flex-col w-8/12">{data ? <UserDetailCard user={data.getUserByUUID} /> : <div>ユーザが見つかりませんでした</div>}</div>
    </div>
  );
};

export { UserDetailPage };
